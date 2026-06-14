import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  submissions: any[];
}

export const SubmissionCards = memo(function SubmissionCards({ submissions }: Props) {
  if (submissions.length === 0) {
    return (
      <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
        <p className="text-zinc-500 mb-4 h-full flex items-center justify-center">No submissions found. Start by submitting a new digital entry.</p>
        <Link to="/dashboard/add-submission">
          <Button variant="outline" className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10">
             Add your first submission
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {submissions.map((sub, idx) => (
        <motion.div 
          key={sub.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-colors shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-lg">
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
      ))}
    </>
  );
});
