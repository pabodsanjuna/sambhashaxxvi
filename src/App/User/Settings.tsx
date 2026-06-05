import { ShieldAlert, Mail, MapPin, Phone, Building2, User, Camera, ShieldCheck, GraduationCap, UploadCloud, QrCode, Download } from 'lucide-react';
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
      // Create a clean A4 PDF (A4 is 595.28 x 841.89 points)
      // Our card aspect ratio is set, we can fit it inside A4 or just match the card size.
      // Let's match the card size to preserve the exact layout: 840x1260
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
    schoolName: schoolDetails?.school_name || "",
    schoolId: schoolDetails?.school_id || "",
    city: schoolDetails?.city || "",
    address: schoolDetails?.address || "",
    phone: schoolDetails?.phone || "",
    registeredEmail: user?.primaryEmailAddress?.emailAddress || "",
  };

  const contactPersons = {
    mic: {
      name: schoolDetails?.mic_name || "",
      title: "Master in Charge",
      phone: schoolDetails?.mic_phone || ""
    },
    coordinator: {
      name: schoolDetails?.coordinator_name || "",
      title: "General Coordinator",
      phone: schoolDetails?.coordinator_phone || ""
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading profile...</div>;
  }

  return (
    <div className="p-6 sm:p-10 space-y-12 animate-in fade-in duration-500">
      <div className="max-w-4xl">
        <h1 className="text-[20px] font-bold text-zinc-500 mb-3 tracking-tight not-italic no-underline">SETTINGS <span className="text-zinc-500 font-normal text-xl ml-2">- SAMBHASHA XXVI USER PORTAL</span></h1>
        <p className="text-zinc-500 text-sm font-medium">Official school profile and administrative records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: School Identity Logos */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6`}
          >
            <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 flex flex-col items-center justify-center opacity-80 overflow-hidden relative">
               <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]" />
               <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 overflow-hidden relative z-10">
                  {schoolDetails?.school_logo_url ? (
                    <img src={schoolDetails.school_logo_url} alt="School Logo" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                  ) : (
                    <Camera className="w-10 h-10 text-zinc-700" />
                  )}
               </div>
               <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold relative z-10">School Logo</span>
            </div>
            <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 flex flex-col items-center justify-center opacity-80 overflow-hidden relative">
               <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]" />
               <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 overflow-hidden relative z-10">
                  {schoolDetails?.media_logo_url ? (
                    <img src={schoolDetails.media_logo_url} alt="Media Unit Logo" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                  ) : (
                    <Camera className="w-10 h-10 text-zinc-700" />
                  )}
               </div>
               <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold relative z-10">Media Logo</span>
            </div>
          </motion.div>

          {/* Section 2: School Profile (Read Only) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] pointer-events-none rounded-[2.5rem]" />
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-zinc-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">School Profile</h2>
                    <p className="text-xs text-zinc-500 mt-1">Immutable identification records</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                   <span className="text-[10px] font-mono text-zinc-400">{schoolDetailsData.schoolId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> School Name
                  </label>
                  <p className="text-sm text-zinc-300 font-semibold">{schoolDetailsData.schoolName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Official Email
                  </label>
                  <p className="text-sm text-zinc-300 font-semibold">{schoolDetailsData.registeredEmail}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Contact Line
                  </label>
                  <p className="text-sm text-zinc-300 font-semibold">{schoolDetailsData.phone}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> City
                  </label>
                  <p className="text-sm text-zinc-300 font-semibold">{schoolDetailsData.city}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Administrative Contacts (Read Only) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 sm:p-12"
          >
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-600" />
               </div>
               <h2 className="text-xl font-bold text-white tracking-tight">Administrative Contacts</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-white/5 px-3 py-1 rounded-lg">Master in Charge</span>
                  <div>
                    <p className="text-lg font-bold text-white">{contactPersons.mic.name}</p>
                    <p className="text-sm text-zinc-400 mt-1">{contactPersons.mic.phone}</p>
                  </div>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-white/5 px-3 py-1 rounded-lg">Co-ordinator</span>
                  <div>
                    <p className="text-lg font-bold text-white">{contactPersons.coordinator.name}</p>
                    <p className="text-sm text-zinc-400 mt-1">{contactPersons.coordinator.phone}</p>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Section 4: Attendance QR Code Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Competition Day Attendance QR</h2>
                </div>
                <p className="text-sm text-zinc-400 mt-2 max-w-md">
                  Generate the official attendance QR code containing your school details to speed up registration during the event.
                </p>
                {/* TODO: Restrict attendance marking to registration-staff authenticated only access */}
              </div>
              <button 
                onClick={downloadQR}
                disabled={isGeneratingQR}
                className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {isGeneratingQR ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isGeneratingQR ? 'Generating...' : 'Download QR PDF'}
              </button>
            </div>
            
            {/* Hidden QR Code Layout for ID Card Generation */}
            <div className="absolute top-[-9999px] left-[-9999px]">
               <EntryPass 
                 ref={qrCardRef}
                 schoolDetails={schoolDetails}
                 schoolDetailsData={schoolDetailsData}
                 contactPersons={contactPersons}
                 originOrigin={window.location.origin}
               />
            </div>
          </motion.div>

          {/* Section 5: Security Restrictions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-red-500/5 backdrop-blur-md rounded-[2.5rem] border border-red-500/10 p-8 flex flex-col sm:flex-row items-center gap-6 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
              <ShieldAlert className="w-7 h-7 text-red-500" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-red-500 font-bold uppercase tracking-widest text-[10px] mb-1">Security Enforcement</h3>
              <p className="text-sm text-red-100/70 font-bold leading-relaxed tracking-tight">
                PASSWORD MODIFICATION IS RESTRICTED BY SYSTEM POLICY.
              </p>
              <p className="text-[10px] font-medium text-red-500/40 mt-1 uppercase tracking-widest">FURTHER ASSISTANCE VIA MAIN ADMINISTRATION PORTAL ONLY.</p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Only Support Desk */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-b from-orange-600 to-orange-500 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden group sticky top-10 border border-orange-400/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-tr-full" />
            <h4 className="font-bold text-2xl mb-2 relative z-10 tracking-tight">Support Desk</h4>
            <div className="space-y-1 mb-8 relative z-10">
              <p className="text-[13px] text-white/90 font-medium leading-tight">Technical & Administrative Support</p>
              <p className="text-[11px] text-white/70">Contact for profile corrections or emergency access.</p>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10 transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-bold block text-white drop-shadow-sm">Pabod Sanjuna</span>
                    <span className="text-[10px] font-medium text-orange-200">Technical Lead</span>
                  </div>
                  <span className="text-[9px] font-bold bg-white text-orange-600 px-2 py-0.5 rounded-full shadow-sm">MAIN ADMIN</span>
                </div>
                <div className="flex items-center text-xs text-white/90 font-mono mt-2 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                  +94 77 692 1838
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/10 transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-bold block text-white drop-shadow-sm">Kisara Vonal</span>
                    <span className="text-[10px] font-medium text-orange-200">Admin</span>
                  </div>
                  <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/10">ADMIN</span>
                </div>
                <div className="flex items-center text-xs text-white/90 font-mono mt-2 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                  +94 76 421 5114
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 relative z-10 text-center">
               <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">SAMBHASHA XXVI • PORTAL SYSTEMS</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
