import { ShieldAlert, Mail, MapPin, Phone, Building2, User, Camera, QrCode, Download, ShieldCheck, MailCheck, LocateFixed, Link2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'motion/react';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { EntryPass } from './components/EntryPass';

export function Settings() {
  const { user } = useUser();
  const { schoolDetails, loading } = useSchoolDetails();
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [contestants, setContestants] = useState<any[]>([]);
  const qrCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadContestants() {
      if (!schoolDetails) return;
      const { data } = await supabase
        .from('contestants')
        .select(`
          name, 
          contestant_id, 
          categories(name, age_group)
        `)
        .eq('school_details_id', schoolDetails.id)
        .order('created_at', { ascending: true });
      if (data) setContestants(data);
    }
    loadContestants();
  }, [schoolDetails]);

  const downloadQR = async () => {
    if (!qrCardRef.current || !schoolDetails) return;
    setIsGeneratingQR(true);
    try {
      const imgData = await htmlToImage.toPng(qrCardRef.current, { quality: 1, backgroundColor: '#ffffff', pixelRatio: 2 });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [480, 720]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 480, 720);
      pdf.save(`${schoolDetails.school_name} - ${schoolDetails.school_id} - SAMBHASHA XXVI ENTRY PASS.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate Attendance QR. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const schoolDetailsData = {
    schoolName: schoolDetails?.school_name || "Not Set",
    schoolId: schoolDetails?.school_id || "NOT-SET",
    city: schoolDetails?.city || "Not Set",
    address: schoolDetails?.address || "Not Set",
    phone: schoolDetails?.phone || "Not Set",
    registeredEmail: user?.primaryEmailAddress?.emailAddress || "Not Set",
  };

  const contactPersons = {
    mic: {
      name: schoolDetails?.mic_name || "Not Set",
      title: "Master in Charge",
      phone: schoolDetails?.mic_phone || "Not Set"
    },
    coordinator: {
      name: schoolDetails?.coordinator_name || "Not Set",
      title: "General Coordinator",
      phone: schoolDetails?.coordinator_phone || "Not Set"
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">School Profile</h1>
          <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Official configuration & administrative records
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Registration ID</span>
            <span className="font-mono text-white text-sm font-bold tracking-tight">{schoolDetailsData.schoolId}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
        
        {/* Left Column: School Details (8 cols wide on desktop) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* Top Row: Logos */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-4 overflow-hidden relative z-10 transition-transform group-hover:scale-105">
                {schoolDetails?.school_logo_url ? (
                  <img src={schoolDetails.school_logo_url} alt="School Logo" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                ) : (
                  <Building2 className="w-8 h-8 text-zinc-700" />
                )}
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">School Logo</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-4 overflow-hidden relative z-10 transition-transform group-hover:scale-105">
                {schoolDetails?.media_logo_url ? (
                  <img src={schoolDetails.media_logo_url} alt="Media Logo" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                ) : (
                  <Camera className="w-8 h-8 text-zinc-700" />
                )}
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Media Area</span>
            </motion.div>
          </div>

          {/* School Information Card */}
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
                  <MapPin className="w-3 h-3" /> School Name
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

          {/* Security Restrictions Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
            className="rounded-[2.5rem] bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 p-6 flex items-center gap-6"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-red-500 font-bold text-sm tracking-tight mb-1">Editing Restrictions Enabled</h3>
              <p className="text-xs text-red-400/80 leading-relaxed max-w-xl">
                Critical profile information is locked to maintain data integrity. Modifications must be processed through the Administration Portal or by contacting technical support.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Attendance QR & Support (4 cols wide on desktop) */}
        <div className="md:col-span-4 flex flex-col gap-6">

          {/* Download QR Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-orange-500 border border-orange-400 rounded-[2.5rem] p-8 text-black relative overflow-hidden group shadow-xl shadow-orange-500/10"
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
               <EntryPass ref={qrCardRef} schoolDetails={schoolDetails} schoolDetailsData={schoolDetailsData} contactPersons={contactPersons} originOrigin={window.location.origin} />
            </div>
          </motion.div>

          {/* Administrative Contacts */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 flex flex-col gap-4 flex-1"
          >
            <div className="px-2 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-bold text-zinc-300 tracking-tight">Key Personnel</h3>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3 flex-1 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{contactPersons.mic.title}</span>
              <div>
                <p className="text-white font-bold leading-tight">{contactPersons.mic.name}</p>
                <p className="text-sm text-zinc-400 mt-1">{contactPersons.mic.phone}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3 flex-1 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{contactPersons.coordinator.title}</span>
              <div>
                <p className="text-white font-bold leading-tight">{contactPersons.coordinator.name}</p>
                <p className="text-sm text-zinc-400 mt-1">{contactPersons.coordinator.phone}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
}

