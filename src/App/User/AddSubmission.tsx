import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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

export function AddSubmission() {
  const navigate = useNavigate();
  const { schoolDetails } = useSchoolDetails();
  
  const [categories, setCategories] = useState<{id: string, name: string, age_group: string}[]>([]);
  const [submitters, setSubmitters] = useState<{id: string, name: string}[]>([]);
  
  const [submitterId, setSubmitterId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionsOpen, setSubmissionsOpen] = useState(true);

  const selectedCategoryData = categories.find(c => c.id === categoryId);

  useEffect(() => {
    async function init() {
      const { data: settings } = await supabase.from('system_settings').select('submissions_open').single();
      if (settings && settings.submissions_open === false) setSubmissionsOpen(false);

      const allowedDigitalCategories = ['Videography', 'Graphic Designing', 'Short Film', 'Photography'];
      const { data } = await supabase.from('categories').select('*');
      if (data) {
        setCategories(data.filter(c => allowedDigitalCategories.includes(c.name)));
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!schoolDetails || !categoryId) {
      setSubmitters([]);
      setSubmitterId('');
      return;
    }
    
    async function loadSubmitters() {
      // Load contestants for the selected category
      const { data: ctData } = await supabase.from('contestants').select('id, contestant_id, name').eq('school_details_id', schoolDetails!.id).eq('category_id', categoryId);
      
      const allSubmitters: {id: string, name: string}[] = [];
      if (ctData) {
        allSubmitters.push(...ctData.map(c => ({ id: c.id, name: `${c.contestant_id} - ${c.name}` })));
      }
      setSubmitters(allSubmitters);
    }
    loadSubmitters();
  }, [schoolDetails, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolDetails || !categoryId || !link || !submitterId) return;
    
    const submitter = submitters.find(s => s.id === submitterId);
    if (!submitter) return;
    
    setIsSubmitting(true);

    try {
      const payload: any = {
        school_details_id: schoolDetails.id,
        contestant_id: submitter?.id,
        category_id: categoryId,
        link
      };

      const { error } = await supabase.from('submissions').insert(payload);

      if (error) {
        console.error('Insert error:', error);
        
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Submission Failed',
          message: error.message || `Failed to add submission for ${selectedCategoryData?.name}.`,
          is_read: false
        });

        alert(error.message || 'Failed to submit.');
      } else {
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Submission Successful',
          message: `Successfully added submission for ${selectedCategoryData?.name}.`,
          is_read: false
        });
        
        alert('Submitted successfully!');
        navigate('/dashboard/submissions');
      }
    } catch (err: any) {
      console.error(err);
      await supabase.from('notifications').insert({
        school_details_id: schoolDetails.id,
        title: 'System Error',
        message: err.message || 'An unexpected error occurred during submission.',
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
      className="p-6 sm:p-10 flex flex-col items-center"
    >
      <div className="w-full max-w-2xl">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-10 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Dashboard
        </button>

        <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]"></div>
          
          <div className="relative z-10">
            {!submissionsOpen ? (
               <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <span className="text-2xl">⏳</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Submissions Closed</h2>
                  <p className="text-zinc-400">The deadline for digital submissions has passed.</p>
               </div>
            ) : (
               <>
                 <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Digital Submission</h1>
                 <p className="text-sm text-zinc-400 mb-10 leading-relaxed font-medium">
                   Submit your digital works to sambhasha xxvi portal. If you need any assistance, contact school media unit admins.
                 </p>

                 <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Category</label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
                    <SelectValue placeholder="Select Competition Category">
                      {selectedCategoryData ? `${selectedCategoryData.name} - ${selectedCategoryData.age_group}` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white shadow-xl">
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id} className="focus:bg-white/10 focus:text-white py-3">
                        {c.name} - {c.age_group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {categoryId && (
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Submitter</label>
                    <Select value={submitterId} onValueChange={setSubmitterId} required>
                      <SelectTrigger className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white focus:ring-white/20">
                        <SelectValue placeholder="Select Contestant">
                          {submitterId ? submitters.find(s => s.id === submitterId)?.name : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white shadow-xl">
                        {submitters.length > 0 ? (
                          submitters.map(s => (
                            <SelectItem key={s.id} value={s.id} className="focus:bg-white/10 focus:text-white py-3">{s.name}</SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-sm text-zinc-500 text-center">No contestants found for this category.</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
              )}

              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Google Drive Link</label>
                <div className="relative">
                  <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="url" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                    placeholder="https://drive.google.com/..." 
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600" 
                  />
                </div>
                {link && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mt-3">
                    <p className="text-xs text-orange-400 font-medium">
                      Warning: Please ensure your Google Drive link permissions are set to "Anyone with the link can view". Otherwise, the judges will not be able to access your submission.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="pt-8">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !submitterId || !categoryId || !link}
                  className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest shadow-xl shadow-white/5 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
               </>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
