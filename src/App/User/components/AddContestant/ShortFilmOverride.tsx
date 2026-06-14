import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export const ShortFilmOverride = memo(function ShortFilmOverride() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-brand-500/10 border border-brand-500/20 rounded-2xl">
      <h3 className="text-brand-500 font-bold mb-2">Short Film Registration</h3>
      <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
        Short film registrations require additional team details and are handled via a dedicated Google Form. Max 10 members per team.
      </p>
      <a 
        href="https://forms.gle/your-form-url-here" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full h-14 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg"
      >
        Open Registration Form <ExternalLink className="w-5 h-5 ml-2" />
      </a>
    </motion.div>
  );
});
