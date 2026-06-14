import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';

import { CompetitionSelection } from './components/AddContestant/CompetitionSelection';
import { AgeGroupSelection } from './components/AddContestant/AgeGroupSelection';

const ShortFilmOverride = lazy(() => import('./components/AddContestant/ShortFilmOverride').then(m => ({ default: m.ShortFilmOverride })));
const ContestantDetailsForm = lazy(() => import('./components/AddContestant/ContestantDetailsForm').then(m => ({ default: m.ContestantDetailsForm })));
const SuccessModal = lazy(() => import('./components/AddContestant/SuccessModal').then(m => ({ default: m.SuccessModal })));

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

  const validateRegistration = (data: { dob: string; nic: string }): string | null => {
    if (isShortFilm) return null; // Handled by external form
    if (!selectedCategory) {
      return 'Please select both competition and age group.';
    }

    if (isSenior && !data.nic) {
      return 'NIC is mandatory for Senior category competitors.';
    }

    const birthYear = parseInt(data.dob.split('-')[0]);
    const birthDate = new Date(data.dob);
    const minSeniorDate = new Date('2007-02-01');

    if (birthDate < minSeniorDate) {
      return 'All competitors must be born on or after 01/02/2007.';
    }

    if (selectedAgeGroup === 'Junior') {
      if (birthYear < 2014 || birthYear > 2016) {
        return 'Junior category requires DOB between 2014 and 2016.';
      }
    } else if (selectedAgeGroup === 'Intermediate') {
      if (birthYear < 2010 || birthYear > 2013) {
        return 'Intermediate category requires DOB between 2010 and 2013.';
      }
    } else if (selectedAgeGroup === 'Senior') {
      if (birthYear < 2007 || birthYear > 2008) {
        return 'Senior category requires DOB between 2007 and 2008.';
      }
    }

    return null;
  };

  const handleFormSubmit = async (data: { name: string; dob: string; mobile: string; nic: string }) => {
    if (isShortFilm) return; // Should not trigger standard submit
    if (!schoolDetails || !selectedCategory || !data.name || !data.dob || !data.mobile) return;
    
    const validationError = validateRegistration(data);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setErrorMsg('');

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
        name: data.name,
        category_id: selectedCategory.id,
        dob: data.dob,
        mobile: data.mobile,
        nic: data.nic || null,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        setErrorMsg(insertError.message || 'Failed to register contestant. Please try again.');
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Registration Failed',
          message: insertError.message || `Failed to register ${data.name} for ${selectedCategory?.name}.`,
          is_read: false
        });
      } else {
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Contestant Registered',
          message: `Successfully registered ${data.name} (${generatedId}) for ${selectedCategory.name} - ${selectedCategory.age_group}.`,
          is_read: false
        });
        
        setSuccessModalData({ show: true, generatedId, name: data.name });
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

                 <div className="space-y-6">
              
              {/* Competition Selection */}
              <CompetitionSelection
                selectedCompetition={selectedCompetition}
                uniqueCompetitions={uniqueCompetitions}
                onChange={handleCompetitionChange}
              />

              {/* Age Group Selection if not Short Film and if groups exist */}
              {selectedCompetition && !isShortFilm && availableAgeGroups.length > 0 && (
                <AgeGroupSelection
                  selectedAgeGroup={selectedAgeGroup}
                  availableAgeGroups={availableAgeGroups}
                  onChange={setSelectedAgeGroup}
                />
              )}

              <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-2xl" />}>
                {/* Short Film Override */}
                {isShortFilm && <ShortFilmOverride />}

                {/* Contestant Details Form (Hidden for Short Film) */}
                {!isShortFilm && selectedCompetition && selectedAgeGroup && (
                  <ContestantDetailsForm
                    selectedAgeGroup={selectedAgeGroup}
                    isSenior={isSenior}
                    errorMsg={errorMsg}
                    isSubmitting={isSubmitting}
                    canSubmit={!!selectedCategory}
                    onSubmit={handleFormSubmit}
                  />
                )}
              </Suspense>

            </div>
               </>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {successModalData?.show && (
          <Suspense fallback={null}>
            <SuccessModal
              name={successModalData.name}
              generatedId={successModalData.generatedId}
              onClose={() => navigate('/dashboard')}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
