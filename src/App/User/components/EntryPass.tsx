import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, CheckCircle2 } from 'lucide-react';

interface EntryPassProps {
  schoolDetails: any;
  schoolDetailsData: any;
  contactPersons: any;
  originOrigin: string; // window.location.origin
}

export const EntryPass = forwardRef<HTMLDivElement, EntryPassProps>(({ schoolDetails, schoolDetailsData, contactPersons, originOrigin }, ref) => {
  return (
    <div 
      ref={ref} 
      className="w-[480px] h-[720px] bg-zinc-950 text-white relative flex flex-col box-border overflow-hidden" 
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
         <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] bg-brand-500/30 rounded-full blur-[80px]" />
         <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-brand-500/20 rounded-full blur-[80px]" />
      </div>

      {/* Outer Border wrapper */}
      <div className="absolute inset-3 border border-white/10 rounded-[24px] pointer-events-none z-20" />
      <div className="absolute inset-4 border border-white/5 rounded-[20px] pointer-events-none z-20 bg-zinc-950/20" />

      <div className="relative z-30 flex flex-col w-full h-full p-10">
          
          {/* Header */}
          <div className="flex justify-between items-start w-full mb-8">
             <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-500 relative">
                    <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-50"></span>
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-brand-400 font-bold">Official Entry Pass</p>
                </div>
                
                <img src="/SAMBHASHA_TEXT_LOGO.webp" alt="SAMBHASHA" className="h-10 w-auto object-left object-contain mb-1" />
                <p className="text-[7px] uppercase tracking-[0.2em] text-white/50 font-bold max-w-[200px]">Nalanda College Communication Unit</p>
             </div>

             {/* School Logo */}
             {schoolDetails?.school_logo_url && (
               <div className="w-14 h-14 p-1.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                 <img src={schoolDetails.school_logo_url} className="w-full h-full object-contain" alt="Logo" crossOrigin="anonymous" referrerPolicy="no-referrer" />
               </div>
             )}
          </div>

          {/* QR Code Section (Centered) */}
          <div className="flex flex-col items-center justify-center flex-1">
             <div className="p-4 bg-white rounded-3xl shadow-2xl mb-6 relative border-[6px] border-white/10 bg-clip-padding">
                <QRCodeSVG 
                  value={`${originOrigin}/attendance/${schoolDetails?.id}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  className="text-black"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border-4 border-white overflow-hidden p-1">
                   <img src="/nccu_logo.webp" alt="NCCU" className="w-full h-full object-contain" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                </div>
             </div>
             
             <div className="flex flex-col items-center text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-2">Authenticator ID</p>
                <div className="inline-flex items-center gap-3">
                   <div className="h-[1px] w-8 bg-white/10"></div>
                   <p className="text-[28px] font-bold font-mono text-white tracking-widest leading-none drop-shadow-lg">{schoolDetailsData.schoolId}</p>
                   <div className="h-[1px] w-8 bg-white/10"></div>
                </div>
                <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-full mt-4">
                   <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                   <p className="text-[9px] font-mono tracking-[0.2em] text-emerald-400 uppercase font-bold">System Validated</p>
                </div>
             </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

          {/* School & Personnel Details Footer */}
          <div className="flex flex-col w-full text-center">
             {/* School Name */}
             <div className="mb-2">
               <h2 className="text-[24px] font-black uppercase tracking-tight leading-[1.1] mb-2 text-white line-clamp-2">{schoolDetailsData.schoolName || 'SCHOOL_NAME'}</h2>
               <div className="inline-flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400" /> 
                  <span className="text-[12px] font-medium text-white/70 uppercase tracking-widest">{schoolDetailsData.city || 'CITY'}</span>
               </div>
             </div>

             {/* Personnel Grid */}
             <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden text-left flex flex-col justify-center">
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-50" />
                   <div className="relative z-10">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Master In Charge</p>
                      <p className="text-[13px] font-bold tracking-wide text-white leading-tight mb-0.5 truncate">{contactPersons.mic.name || 'MIC Name'}</p>
                      <p className="text-[9px] text-brand-200/70 font-mono tracking-widest">{contactPersons.mic.phone || 'Phone'}</p>
                   </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden text-left flex flex-col justify-center">
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-50" />
                   <div className="relative z-10">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Co-ordinator</p>
                      <p className="text-[13px] font-bold tracking-wide text-white leading-tight mb-0.5 truncate">{contactPersons.coordinator.name || 'Co-ordinator Name'}</p>
                      <p className="text-[9px] text-brand-200/70 font-mono tracking-widest">{contactPersons.coordinator.phone || 'Phone'}</p>
                   </div>
                </div>
             </div>
          </div>
          
      </div>
    </div>
  );
});

EntryPass.displayName = 'EntryPass';
