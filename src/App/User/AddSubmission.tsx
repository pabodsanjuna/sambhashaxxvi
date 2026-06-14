import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import { CategorySelection } from './components/AddSubmission/CategorySelection';
import { SubmitterSelection } from './components/AddSubmission/SubmitterSelection';

const SubmissionDetailsForm = lazy(() => import('./components/AddSubmission/SubmissionDetailsForm').then(m => ({ default: m.SubmissionDetailsForm })));

export function AddSubmission() {
  const navigate = useNavigate();
  const { schoolDetails } = useSchoolDetails();
  
  const [categories, setCategories] = useState<{id: string, name: string, age_group: string}[]>([]);
  const [submitters, setSubmitters] = useState<{id: string, name: string}[]>([]);
  
  const [submitterId, setSubmitterId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionsOpen, setSubmissionsOpen] = useState(true);
  const [submissionStart, setSubmissionStart] = useState(true);

  const selectedCategoryData = categories.find(c => c.id === categoryId);

  useEffect(() => {
    async function init() {
      const { data: settings } = await supabase.from('system_settings').select('submissions_open, submission_start').single();
      if (settings) {
         if (settings.submissions_open === false) setSubmissionsOpen(false);
         if (settings.submission_start === false) setSubmissionStart(false);
      }

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

  const handleFormSubmit = async (link: string) => {
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
        const submitTime = new Date().toLocaleString();
        const successMessage = `Successfully added submission.\nSubmitter: ${submitter.name}\nCategory: ${selectedCategoryData?.name}\nSubmit time: ${submitTime}`;
        
        await supabase.from('notifications').insert({
          school_details_id: schoolDetails.id,
          title: 'Submission Successful',
          message: successMessage,
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
            {!submissionStart ? (
               <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Access Restricted</h2>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">Submissions are not open yet.</p>
               </div>
            ) : !submissionsOpen ? (
               <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Submissions Closed</h2>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">The deadline for digital submissions has passed.</p>
               </div>
            ) : (
               <>
                 <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Digital Submission</h1>
                 <p className="text-sm text-zinc-400 mb-10 leading-relaxed font-medium">
                   Submit your digital works to sambhasha xxvi portal. If you need any assistance, contact school media unit admins.
                 </p>

                 <div className="space-y-6">
              <CategorySelection
                categoryId={categoryId}
                categories={categories}
                selectedCategoryData={selectedCategoryData}
                onChange={setCategoryId}
              />

              {categoryId && (
                <SubmitterSelection
                  submitterId={submitterId}
                  submitters={submitters}
                  onChange={setSubmitterId}
                />
              )}

              <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-2xl" />}>
                {categoryId && submitterId && (
                  <SubmissionDetailsForm
                    isSubmitting={isSubmitting}
                    canSubmit={true}
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
    </motion.div>
  );
}
