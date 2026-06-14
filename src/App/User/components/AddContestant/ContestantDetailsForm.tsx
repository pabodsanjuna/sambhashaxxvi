import React, { useState, memo } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

export interface ContestantFormData {
  name: string;
  dob: string;
  mobile: string;
  nic: string;
}

interface Props {
  selectedAgeGroup: string;
  isSenior: boolean;
  errorMsg: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: (data: ContestantFormData) => void;
}

export const ContestantDetailsForm = memo(function ContestantDetailsForm({
  selectedAgeGroup,
  isSenior,
  errorMsg,
  isSubmitting,
  canSubmit,
  onSubmit
}: Props) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [nic, setNic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, dob, mobile, nic });
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-2 border-t border-white/5" onSubmit={handleSubmit}>
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
          NIC {isSenior ? <span className="text-brand-500">(Mandatory)</span> : <span className="text-zinc-600">(Optional)</span>}
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
          disabled={isSubmitting || !canSubmit}
          className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest shadow-xl shadow-white/5 disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Confirm Registration'}
        </Button>
      </div>
    </motion.form>
  );
});
