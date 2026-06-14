import React, { memo, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Building2, LocateFixed, Phone, MailCheck } from 'lucide-react';

interface Props {
  schoolDetailsData: {
    schoolName: string;
    schoolId: string;
    city: string;
    address: string;
    phone: string;
    registeredEmail: string;
  };
}

export const SchoolIdentityCard = memo(function SchoolIdentityCard({ schoolDetailsData }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8">
        <Building2 className="w-5 h-5 text-zinc-500" />
        <h2 className="text-lg font-bold text-white tracking-tight">Identity Details</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-10 relative z-10">
        <div className="space-y-1.5 focus-within:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
            <Building2 className="w-3 h-3" /> School Name
          </label>
          <p className="text-white font-medium">{schoolDetailsData.schoolName}</p>
        </div>
        
        <div className="space-y-1.5 focus-within:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
            <LocateFixed className="w-3 h-3" /> City / Location
          </label>
          <p className="text-white font-medium">{schoolDetailsData.city}</p>
        </div>

        <div className="space-y-1.5 focus-within:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
            <Phone className="w-3 h-3" /> Contact Number
          </label>
          <p className="text-white font-medium">{schoolDetailsData.phone}</p>
        </div>

        <div className="space-y-1.5 focus-within:bg-white/5 p-4 -ml-4 rounded-2xl transition-colors">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2">
            <MailCheck className="w-3 h-3" /> Registered Email
          </label>
          <p className="text-white font-medium">{schoolDetailsData.registeredEmail}</p>
        </div>
      </div>
    </motion.div>
  );
});
