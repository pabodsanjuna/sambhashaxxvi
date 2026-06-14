import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Search, CheckCircle2, AlertCircle, Scan, UserCheck, X, Smartphone, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

export function AttendanceScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileQR, setShowMobileQR] = useState(false);

  const [remoteConnected, setRemoteConnected] = useState(false);
  // Generate a unique session ID once per laptop page load
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));

  // Mutable ref so channel captures the latest version of handleScan
  const handleScanRef = useRef<((text: string) => Promise<void>) | null>(null);

  useEffect(() => {
    const channelName = `scanner-${sessionId}`;
    let existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
    
    if (existing) {
      supabase.removeChannel(existing);
    }
    
    const channel = supabase.channel(channelName);
    
    channel.on('broadcast', { event: 'scan' }, (payload) => {
      setRemoteConnected(true);
      if (payload.payload?.text && handleScanRef.current) {
        handleScanRef.current(payload.payload.text);
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleScan = async (text: string) => {
    if (processing || !text || text === scanResult?.raw) return;
    setProcessing(true);
    setError(null);
    try {
      let schoolId = '';
      if (text.includes('/attendance/')) {
         schoolId = text.split('/attendance/')[1];
      } else {
         const data = JSON.parse(text);
         schoolId = data.school_id;
      }

      if (!schoolId) throw new Error("Invalid QR code format.");

      const { data: school, error: schoolErr } = await supabase
        .from('school_details')
        .select('*')
        .eq('id', schoolId)
        .single();
      
      if (schoolErr) throw new Error("School not found.");

      const { data: contestants, error: contErr } = await supabase
         .from('contestants')
         .select('id, name, is_attended, contestant_id, categories(name)')
         .eq('school_details_id', schoolId);
      
      setSearch('');
      setScanResult({ raw: text, school, contestants });
    } catch(err: any) {
      setError(err.message || "Failed to process QR code.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    handleScanRef.current = handleScan;
  }, [handleScan]);

  const handleMarkPresent = async (contestantId: string) => {
    try {
      const { error } = await supabase
        .from('contestants')
        .update({ is_attended: true, attendance_time: new Date().toISOString() })
        .eq('id', contestantId);
      
      if (error) throw error;
      
      if (scanResult) {
         setScanResult({
            ...scanResult,
            contestants: scanResult.contestants.map((c: any) => c.id === contestantId ? {...c, is_attended: true} : c)
         });
      }

      setSearchResults(searchResults.map(c => c.id === contestantId ? {...c, is_attended: true} : c));

    } catch(err: any) {
      alert("Error marking attendance.");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!search.trim()) return;
     setIsSearching(true);
     try {
       const [nameRes, schoolRes] = await Promise.all([
         supabase
           .from('contestants')
           .select('id, name, is_attended, contestant_id, school_details!inner(school_name)')
           .ilike('name', `%${search}%`)
           .limit(20),
         supabase
           .from('contestants')
           .select('id, name, is_attended, contestant_id, school_details!inner(school_name)')
           .ilike('school_details.school_name', `%${search}%`)
           .limit(20)
       ]);

       const combined = [...(nameRes.data || []), ...(schoolRes.data || [])];
       const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
       
       setSearchResults(unique.slice(0, 20));
     } catch (err) {
       console.error(err);
     } finally {
       setIsSearching(false);
     }
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 relative">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 relative z-0">
        
        {/* Left Column: Scanner */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="text-center lg:text-left flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Scan & Mark</h1>
              <p className="text-zinc-400 text-sm mb-4 lg:mb-0">Scan school QR code to mark attendance.</p>
            </div>
            <button 
              onClick={() => setShowMobileQR(true)}
              className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg"
              title="Use Phone to Scan"
            >
              <Smartphone className="w-4 h-4 text-white" />
              Use Phone
            </button>
          </div>

          <div className="bg-zinc-950/50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
               <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[3/4] bg-black">
                  <Scanner 
                     onScan={(result) => result[0] && handleScan(result[0].rawValue)} 
                     components={{ finder: false }}
                     styles={{ container: { width: '100%', height: '100%' } }}
                  />
                  
                  {/* Scanner Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute inset-0 bg-black/40" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-56 h-56 relative box-content">
                           {/* Hollow Cutout using box-shadow trick */}
                           <div className="absolute inset-0 rounded-3xl shadow-md" />
                           {/* Corner Brackets */}
                           <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-3xl opacity-80" />
                           <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-3xl opacity-80" />
                           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-3xl opacity-80" />
                           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-3xl opacity-80" />
                           {/* Scanning Line */}
                           <div className="absolute left-4 right-4 h-[2px] bg-white/10 shadow-md animate-scan" />
                        </div>
                     </div>
                  </div>

                  {processing && (
                     <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                           <Scan className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <p className="font-bold tracking-widest text-xs uppercase text-white">Processing QR</p>
                     </div>
                  )}
               </div>

            <AnimatePresence>
               {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 bg-red-500/95 backdrop-blur shadow-2xl text-white px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 z-20"
                  >
                     <AlertCircle className="w-5 h-5 shrink-0 text-red-200" />
                     <p className="flex-1 drop-shadow-sm">{error}</p>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Search & Scan Results */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl flex-1 flex flex-col">
            {scanResult ? (
              <>
                <div className="mb-6 flex justify-between items-start gap-4 border-b border-white/10 pb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                       </div>
                       <p className="text-xs font-bold text-green-500 uppercase tracking-widest">School Scanned</p>
                    </div>
                    <h2 className="text-2xl font-black mb-4">{scanResult.school.school_name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                          <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-1">School ID</p>
                          <p className="font-mono text-sm">{scanResult.school.school_id}</p>
                       </div>
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                          <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-1">MIC Details</p>
                          <p className="text-sm font-bold">{scanResult.school.mic_name}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{scanResult.school.mic_phone}</p>
                       </div>
                       <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                          <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-1">Coordinator</p>
                          <p className="text-sm font-bold">{scanResult.school.coordinator_name}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{scanResult.school.coordinator_phone}</p>
                       </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setScanResult(null); setSearch(''); setSearchResults([]); }} 
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                   <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                         <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                      </div>
                      <input 
                         type="text" 
                         placeholder="Filter names within this school..."
                         value={search}
                         onChange={e => setSearch(e.target.value)}
                         className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 focus:bg-black/60 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-zinc-600"
                      />
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[300px] pr-2 space-y-3">
                   {scanResult.contestants.filter((c: any) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contestant_id.toLowerCase().includes(search.toLowerCase())).map((c: any) => (
                      <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all gap-4">
                         <div>
                            <p className="font-bold text-base mb-1">{c.name}</p>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                               <span className="font-mono bg-white/5 px-2 py-0.5 rounded">{c.contestant_id}</span>
                               <span>•</span>
                               <span className="truncate max-w-[200px] line-clamp-1">{c.categories?.name || 'Multiple Categories'}</span>
                            </div>
                         </div>
                         <button 
                            onClick={() => !c.is_attended && handleMarkPresent(c.id)}
                            disabled={c.is_attended}
                            className={`shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                              c.is_attended 
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-not-allowed' 
                                : 'bg-white text-black hover:bg-white text-black shadow-md hover:shadow-md'
                            }`}
                         >
                            {c.is_attended ? (
                              <>
                                <UserCheck className="w-4 h-4" /> Present
                              </>
                            ) : 'Mark Present'}
                         </button>
                      </div>
                   ))}
                   {scanResult.contestants.filter((c: any) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contestant_id.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                      <div className="text-center py-12 text-zinc-500 text-sm">No contestants match your filter.</div>
                   )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                     <Search className="w-5 h-5 text-white" />
                     Manual Search
                  </h2>
                  <p className="text-sm text-zinc-500">Search by contestant name or school name if QR is unavailable.</p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3 mb-8">
                   <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                         <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                      </div>
                      <input 
                         type="text" 
                         placeholder="Search name or school..."
                         value={search}
                         onChange={e => setSearch(e.target.value)}
                         className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 focus:bg-black/60 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-zinc-600"
                      />
                   </div>
                   <button 
                     type="submit" 
                     disabled={isSearching}
                     className="h-14 px-6 sm:px-8 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSearching ? '...' : 'Search'}
                   </button>
                </form>

                <div className="flex-1 overflow-y-auto min-h-[300px]">
                   {searchResults.length > 0 ? (
                      <div className="space-y-3 pr-2">
                         {searchResults.map(c => (
                            <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all gap-4">
                               <div>
                                  <p className="font-bold text-base mb-1">{c.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                                     <span className="font-mono bg-white/5 px-2 py-0.5 rounded">{c.contestant_id}</span>
                                     <span>•</span>
                                     <span className="truncate max-w-[200px]">{c.school_details?.school_name}</span>
                                  </div>
                               </div>
                               <button 
                                  onClick={() => !c.is_attended && handleMarkPresent(c.id)}
                                  disabled={c.is_attended}
                                  className={`shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                    c.is_attended 
                                      ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-not-allowed' 
                                      : 'bg-white text-black hover:bg-white text-black shadow-md hover:shadow-md'
                                  }`}
                               >
                                  {c.is_attended ? (
                                    <>
                                      <UserCheck className="w-4 h-4" /> Present
                                    </>
                                  ) : 'Mark Present'}
                               </button>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 py-12">
                         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Search className="w-8 h-8 opacity-50" />
                         </div>
                         <p className="text-sm">Search results will appear here</p>
                      </div>
                   )}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile QR Code Modal */}
      <AnimatePresence>
        {showMobileQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowMobileQR(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8 pt-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Scan with Phone</h2>
                <p className="text-zinc-400 text-sm">
                  Scan this QR code with your mobile phone camera to open the scanner on your phone.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-inner flex justify-center mb-6 border border-zinc-200">
                <QRCodeSVG
                  value={`${window.location.origin}/remote-scanner?session=${sessionId}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="text-center">
                 <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-t border-white/5 pt-6 mt-2">
                    Open your camera app and point it here
                 </p>
                 {remoteConnected && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex flex-col items-center gap-2"
                    >
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">
                         <Wifi className="w-3 h-3" /> Phone Connected
                       </div>
                    </motion.div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
