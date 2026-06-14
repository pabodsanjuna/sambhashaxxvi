import { useState, useEffect, lazy, Suspense } from 'react';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubmissionCards = lazy(() => import('./components/SubmissionsList/SubmissionCards').then(m => ({ default: m.SubmissionCards })));

export function SubmissionsList() {
  const { schoolDetails } = useSchoolDetails();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionStart, setSubmissionStart] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      if (!schoolDetails) return;
      setLoading(true);
      
      const { data: settings } = await supabase.from('system_settings').select('submission_start').single();
      if (settings && settings.submission_start === false) {
        setSubmissionStart(false);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          link,
          created_at,
          category_id,
          categories(name, age_group),
          contestants(name, contestant_id)
        `)
        .eq('school_details_id', schoolDetails.id)
        .order('created_at', { ascending: false });

      if (data) {
        setSubmissions(data);
      }
      setLoading(false);
    }
    loadSubmissions();
  }, [schoolDetails]);

  if (loading) {
    return <div className="p-10 text-white">Loading submissions...</div>;
  }

  if (!submissionStart) {
    return (
      <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 sm:p-12 shadow-2xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Access Restricted</h2>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">Submissions are not open yet. Please check back later when the portal is unlocked.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Submissions</h1>
          <p className="text-zinc-400">View all your digital entries submitted to Sambhasha XXVI.</p>
        </div>
        <Link to="/dashboard/add-submission">
          <Button className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6 h-12 shadow-xl shadow-white/5 transition-all">
            <Plus className="w-5 h-5 mr-2" />
            Add Submission
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <Suspense fallback={<div className="col-span-full py-20 text-center text-zinc-500">Loading submissions...</div>}>
          <SubmissionCards submissions={submissions} />
        </Suspense>
      </div>
    </div>
  );
}
