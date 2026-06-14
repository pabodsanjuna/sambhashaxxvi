import React, { useState, memo } from 'react';
import { motion } from 'motion/react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: (link: string) => void;
}

export const SubmissionDetailsForm = memo(function SubmissionDetailsForm({
  isSubmitting,
  canSubmit,
  onSubmit
}: Props) {
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(link);
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-2 border-t border-white/5" onSubmit={handleSubmit}>
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
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl mt-3">
            <p className="text-xs text-brand-400 font-medium">
              Warning: Please ensure your Google Drive link permissions are set to "Anyone with the link can view". Otherwise, the judges will not be able to access your submission.
            </p>
          </motion.div>
        )}
      </div>

      <div className="pt-8">
        <Button 
          type="submit" 
          disabled={isSubmitting || !canSubmit || !link}
          className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest shadow-xl shadow-white/5 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.form>
  );
});
