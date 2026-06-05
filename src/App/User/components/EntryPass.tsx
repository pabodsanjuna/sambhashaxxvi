import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin } from 'lucide-react';

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
      className="w-[480px] h-[720px] bg-white text-black relative flex flex-col p-8 box-border overflow-hidden" 
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Borders */}
      <div className="absolute inset-4 border border-black/10 rounded-2xl pointer-events-none" />

      {/* Header area */}
      <div className="z-10 w-full flex justify-between items-center mt-2 mb-8 px-2">
         <div className="flex flex-col">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2">Entry Pass</p>
            <h1 className="text-[36px] font-black leading-none tracking-tight text-black flex items-center" style={{ fontFamily: '"Bruny", "Bruno Ace", sans-serif' }}>
               SAMBHASHA XXVI
            </h1>
            <p className="text-[8px] uppercase tracking-[0.1em] text-black mt-2 font-bold border-t border-black/10 pt-2 w-max">Nalanda College Communication Unit</p>
         </div>
         {/* Logos */}
         <div className="flex gap-4">
           {schoolDetails?.school_logo_url && (
             <div className="w-16 h-16 p-1 bg-white rounded-lg border border-black/10 flex items-center justify-center overflow-hidden">
               <img src={schoolDetails.school_logo_url} className="w-full h-full object-contain" alt="Logo" crossOrigin="anonymous" referrerPolicy="no-referrer" />
             </div>
           )}
         </div>
      </div>

      <div className="z-10 w-full flex-1 flex flex-col mb-6 px-2">
         {/* School Name block */}
         <div className="mb-10">
            <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 mb-2 uppercase">School Profile <span className="text-zinc-300 mx-2">|</span> <span className="text-black font-bold">{schoolDetailsData.schoolId || 'REG-ID'}</span></p>
            <h2 className="text-[28px] font-black uppercase tracking-tight leading-[1.1] mb-2 text-black line-clamp-2">{schoolDetailsData.schoolName || 'SCHOOL_NAME'}</h2>
            <h3 className="text-[14px] font-medium text-zinc-600 uppercase tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" /> 
              {schoolDetailsData.city || 'CITY'}
            </h3>
         </div>

         {/* Grid for details */}
         <div className="grid grid-cols-1 gap-6 mb-auto">
            <div className="border-l-2 border-black/10 pl-4">
               <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Master In Charge</p>
               <p className="text-[16px] font-bold tracking-tight text-black leading-tight">{contactPersons.mic.name || 'MIC Name'}</p>
               <p className="text-[14px] text-zinc-600 font-mono mt-1">{contactPersons.mic.phone || 'Phone'}</p>
            </div>
            <div className="border-l-2 border-black/10 pl-4">
               <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Co-ordinator</p>
               <p className="text-[16px] font-bold tracking-tight text-black leading-tight">{contactPersons.coordinator.name || 'Co-ordinator Name'}</p>
               <p className="text-[14px] text-zinc-600 font-mono mt-1">{contactPersons.coordinator.phone || 'Phone'}</p>
            </div>
         </div>
      </div>

      {/* Bottom QR Section */}
      <div className="z-10 mt-auto flex justify-between items-end w-full px-2 border-t border-black/10 pt-6">
        <div className="space-y-4">
           <div>
             <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-1">Authenticator ID</p>
             <p className="text-[24px] font-bold font-mono text-black tracking-wider leading-none">{schoolDetailsData.schoolId}</p>
           </div>
           <div>
              <p className="text-[8px] font-mono tracking-[0.2em] text-zinc-500 mt-2 uppercase">System Validated</p>
           </div>
        </div>

        <div className="p-2 bg-white border border-black/10 rounded-xl">
            <QRCodeSVG 
              value={`${originOrigin}/attendance/${schoolDetails?.id}`}
              size={120}
              level="H"
              includeMargin={false}
              className="text-black"
            />
        </div>
      </div>

      {/* Generated details vertical right */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 origin-center -rotate-90 z-10 opacity-30 pointer-events-none">
           <p className="text-[8px] uppercase tracking-[0.6em] font-bold text-black whitespace-nowrap">PORTAL SYSTEMS • {new Date().getFullYear()}</p>
      </div>
    </div>
  );
});

EntryPass.displayName = 'EntryPass';
