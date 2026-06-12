import { useState, useEffect } from 'react';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        {submissions.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <p className="text-zinc-500 mb-4 h-full flex items-center justify-center">No submissions found. Start by submitting a new digital entry.</p>
            <Link to="/dashboard/add-submission">
              <Button variant="outline" className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10">
                 Add your first submission
              </Button>
            </Link>
          </div>
        ) : (
          submissions.map((sub, idx) => (
            <motion.div 
              key={sub.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-lg">
                  {sub.categories?.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(sub.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-zinc-500 font-medium mb-1">Submitter</h3>
                  <p className="font-bold text-white">
                    {sub.contestants ? `${sub.contestants.contestant_id} - ${sub.contestants.name}` : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm text-zinc-500 font-medium mb-1">Category & Age Group</h3>
                  <p className="text-zinc-300 text-sm">
                    {sub.categories?.name} - {sub.categories?.age_group}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <a 
                    href={sub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    <span className="truncate flex-1">{sub.link}</span>
                    <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
