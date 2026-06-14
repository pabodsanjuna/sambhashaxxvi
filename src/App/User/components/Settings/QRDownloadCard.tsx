import React, { memo } from 'react';
import { motion } from 'motion/react';
import { QrCode, Download } from 'lucide-react';
import { EntryPass } from '../EntryPass';

interface Props {
  isGeneratingQR: boolean;
  downloadQR: () => void;
  qrCardRef: React.RefObject<HTMLDivElement>;
  schoolDetails: any;
  schoolDetailsData: any;
  contactPersons: any;
  originURL: string;
}

export const QRDownloadCard = memo(function QRDownloadCard({
  isGeneratingQR,
  downloadQR,
  qrCardRef,
  schoolDetails,
  schoolDetailsData,
  contactPersons,
  originURL
}: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-brand-500 border border-brand-400 rounded-[2.5rem] p-8 text-black relative overflow-hidden group shadow-xl shadow-brand-500/10"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="mb-6 relative z-10">
        <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center mb-4">
          <QrCode className="w-6 h-6 text-black" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight leading-tight mb-2">Event<br/>Entry Pass</h3>
        <p className="text-black/70 text-sm font-medium">Download your school's QR for rapid registration on competition day.</p>
      </div>

      <button 
        onClick={downloadQR}
        disabled={isGeneratingQR}
        className="w-full bg-black text-white hover:bg-zinc-900 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50 relative z-10"
      >
        {isGeneratingQR ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        {isGeneratingQR ? 'Generating PDF...' : 'Download PDF'}
      </button>
      
      {/* Hidden QR generation component */}
      <div className="absolute top-[9999px] left-[9999px] opacity-0 pointer-events-none">
         <EntryPass ref={qrCardRef as any} schoolDetails={schoolDetails} schoolDetailsData={schoolDetailsData} contactPersons={contactPersons} originOrigin={originURL} />
      </div>
    </motion.div>
  );
});
