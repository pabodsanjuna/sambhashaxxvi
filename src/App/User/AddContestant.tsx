import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';

interface Category {
  id: string;
  name: string;
  age_group: string;
}

export function AddContestant() {
  const navigate = useNavigate();
  const { schoolDetails } = useSchoolDetails();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{show: boolean, generatedId: string, name: string} | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  // Form State
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [nic, setNic] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Validations
  useEffect(() => {
    async function init() {
      const { data: settings } = await supabase.from('system_settings').select('registration_open').single();
      if (settings && settings.registration_open === false) setRegistrationOpen(false);

      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    }
    init();
  }, []);

  const uniqueCompetitions = useMemo(() => {
    const names = new Set(categories.map(c => c.name));
    return Array.from(names).sort();
  }, [categories]);

  const availableAgeGroups = useMemo(() => {
    return categories.filter(c => c.name === selectedCompetition).map(c => c.age_group).sort();
  }, [categories, selectedCompetition]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.name === selectedCompetition && c.age_group === selectedAgeGroup);
  }, [categories, selectedCompetition, selectedAgeGroup]);

  // Handle Competition Change
  const handleCompetitionChange = (val: string) => {
    setSelectedCompetition(val);
    setSelectedAgeGroup(''); // Reset age group
    setErrorMsg('');
  };

  const isShortFilm = selectedCompetition === 'Short Film';
  const isSenior = selectedAgeGroup === 'Senior';

  const validateRegistration = () => {
    if (isShortFilm) return true; // Handled by external form
    if (!selectedCategory) {
      setErrorMsg('Please select both competition and age group.');
      return false;
    }

    if (isSenior && !nic) {
      setErrorMsg('NIC is mandatory for Senior category competitors.');
      return false;
    }

    const birthYear = parseInt(dob.split('-')[0]);
    const birthDate = new Date(dob);
    const minSeniorDate = new Date('2007-02-01');

    if (birthDate < minSeniorDate) {
      setErrorMsg('All competitors must be born on or after 01/02/2007.');
      return false;
    }

    if (selectedAgeGroup === 'Junior') {
      if (birthYear < 2014 || birthYear > 2016) {
        setErrorMsg('Junior category requires DOB between 2014 and 2016.');
        return false;
      }
    } else if (selectedAgeGroup === 'Intermediate') {
      if (birthYear < 2010 || birthYear > 2013) {
        setErrorMsg('Intermediate category requires DOB between 2010 and 2013.');
        return false;
      }
    } else if (selectedAgeGroup === 'Senior') {
      if (birthYear < 2007 || birthYear > 2008) {
        setErrorMsg('Senior category requires DOB between 2007 and 2008.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isShortFilm) return; // Should not trigger standard submit
    if (!schoolDetails || !selectedCategory || !name || !dob || !mobile) return;
    
    setErrorMsg('');
    if (!validateRegistration()) return;

    setIsSubmitting(true);

    try {
      // Check maximum 2 per category per school
      const { count, error: countError } = await supabase
        .from('contestants')
        .select('*', { count: 'exact', head: true })
        .eq('school_details_id', schoolDetails.id)
        .eq('category_id', selectedCategory.id);

      if (countError) throw countError;
      if (count !== null && count >= 2) {
        setErrorMsg('Maximum 2 contestants are allowed per category.');
        
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Registration Failed',
          message: `Maximum 2 contestants limit reached for ${selectedCategory.name} - ${selectedCategory.age_group}.`,
          is_read: false
        });

        setIsSubmitting(false);
        return;
      }

      // Generate Contestant ID
      const { data: generatedId, error: rpcError } = await supabase.rpc('generate_contestant_id', {
        p_category_id: selectedCategory.id
      });

      if (rpcError) throw rpcError;

      const { error: insertError } = await supabase.from('contestants').insert({
        school_details_id: schoolDetails.id,
        contestant_id: generatedId,
        name,
        category_id: selectedCategory.id,
        dob,
        mobile,
        nic: nic || null,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        setErrorMsg(insertError.message || 'Failed to register contestant. Please try again.');
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Registration Failed',
          message: insertError.message || `Failed to register ${name} for ${selectedCategory?.name}.`,
          is_read: false
        });
      } else {
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Contestant Registered',
          message: `Successfully registered ${name} (${generatedId}) for ${selectedCategory.name} - ${selectedCategory.age_group}.`,
          is_read: false
        });
        
        setSuccessModalData({ show: true, generatedId, name });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
      await supabase.from('notifications').insert({
        school_details_id: schoolDetails.id,
        title: 'System Error',
        message: err.message || 'An unexpected error occurred during registration.',
        is_read: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 sm:p-10 flex flex-col items-center min-h-full pb-20"
    >
      <div className="w-full max-w-2xl">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Dashboard
        </button>

        <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]" />
          
          <div className="relative z-10">
            {!registrationOpen ? (
               <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Registration Closed</h2>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">The deadline for contestant registration has passed.</p>
               </div>
            ) : (
               <>
                 <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Register Contestant</h2>
                 <p className="text-sm text-zinc-400 mb-8 leading-relaxed font-medium">
                   Notice: You cannot modify entries after submission. <br />
                   Finalize all details before confirmation.
                 </p>

                 <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Competition Selection */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Competition Name</label>
                <Select value={selectedCompetition} onValueChange={handleCompetitionChange} required>
                  <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select Competition" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white max-h-[300px]">
                    {uniqueCompetitions.map(name => (
                      <SelectItem key={name} value={name} className="focus:bg-white/10 focus:text-white py-3">{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age Group Selection if not Short Film and if groups exist */}
              {selectedCompetition && !isShortFilm && availableAgeGroups.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Age Group</label>
                  <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup} required>
                    <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
                      <SelectValue placeholder="Select Age Group" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white">
                      {availableAgeGroups.map(group => (
                        <SelectItem key={group} value={group} className="focus:bg-white/10 focus:text-white py-3">{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {/* Short Film Override */}
              {isShortFilm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                  <h3 className="text-orange-500 font-bold mb-2">Short Film Registration</h3>
                  <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                    Short film registrations require additional team details and are handled via a dedicated Google Form. Max 10 members per team.
                  </p>
                  <a 
                    href="https://forms.gle/your-form-url-here" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full h-14 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-lg"
                  >
                    Open Registration Form <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </motion.div>
              )}

              {/* Contestant Details Form (Hidden for Short Film) */}
              {!isShortFilm && selectedCompetition && selectedAgeGroup && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-2 border-t border-white/5">
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter full name in English" 
                      className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-3">
                       <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                         Date of Birth
                         {selectedAgeGroup === 'Junior' && ' (2014-2016)'}
                         {selectedAgeGroup === 'Intermediate' && ' (2010-2013)'}
                         {selectedAgeGroup === 'Senior' && ' (2007-2008)'}
                       </label>
                       <input 
                         type="date" 
                         value={dob}
                         onChange={(e) => setDob(e.target.value)}
                         required
                         className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600 [color-scheme:dark]" 
                       />
                     </div>
                     <div className="space-y-3">
                       <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Mobile Number</label>
                       <input 
                         type="tel" 
                         value={mobile}
                         onChange={(e) => setMobile(e.target.value)}
                         required
                         placeholder="071XXXXXXX" 
                         className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600" 
                       />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                      NIC {isSenior ? <span className="text-orange-500">(Mandatory)</span> : <span className="text-zinc-600">(Optional)</span>}
                    </label>
                    <input 
                      type="text" 
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      required={isSenior}
                      placeholder="Enter NIC number" 
                      className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600" 
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !selectedCategory}
                      className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest shadow-xl shadow-white/5 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                    </Button>
                  </div>
                </motion.div>
              )}

            </form>
               </>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {successModalData?.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full relative overflow-hidden"
            >
               <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Registration Successful</h3>
                  <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                    <strong className="text-white font-medium">{successModalData.name}</strong> has been successfully registered. 
                    <br /><br />
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Contestant ID</span>
                    <span className="text-lg font-mono text-white bg-white/5 py-2 px-4 rounded-xl border border-white/10 inline-block">{successModalData.generatedId}</span>
                  </p>
                  
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                  >
                    Return to Dashboard
                  </Button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
