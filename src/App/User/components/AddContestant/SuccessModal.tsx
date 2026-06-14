import React, { memo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  name: string;
  generatedId: string;
  onClose: () => void;
}

export const SuccessModal = memo(function SuccessModal({ name, generatedId, onClose }: Props) {
  return (
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
            <strong className="text-white font-medium">{name}</strong> has been successfully registered. 
            <br /><br />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Contestant ID</span>
            <span className="text-lg font-mono text-white bg-white/5 py-2 px-4 rounded-xl border border-white/10 inline-block">{generatedId}</span>
          </p>
          
          <Button 
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
          >
            Return to Dashboard
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
});
