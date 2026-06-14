import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Smartphone, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Bg } from '@/components/Bg';

export function RemoteScanner() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) return;

    const channelName = `scanner-${sessionId}`;
    
    // First clean up any existing channels with this name to avoid React 18 strict mode double-joins
    const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
    if (existing) {
      supabase.removeChannel(existing);
    }

    const newChannel = supabase.channel(channelName);
    
    newChannel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.warn('Channel status:', status);
      }
    });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [sessionId]);

  const handleScan = async (text: string) => {
    if (!sessionId || !text || !channel || text === lastScanned) return;

    setLastScanned(text);
    
    // Broadcast the scanned text to the session channel
    try {
      await channel.send({
        type: 'broadcast',
        event: 'scan',
        payload: { text }
      });
    } catch (err) {
      console.error("Broadcast failed:", err);
      setError("Failed to send scan to laptop");
    }

    // Reset last scanned after a delay so they can scan another code
    setTimeout(() => {
      setLastScanned(null);
      setError(null);
    }, 2500);
  };

  if (!sessionId) {
    return (
      <Bg className="flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center max-w-sm text-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h2 className="text-xl font-bold">Invalid Session</h2>
          <p className="text-zinc-400 text-sm">No active scanner session found. Please scan the QR code from the laptop screen again.</p>
        </div>
      </Bg>
    );
  }

  return (
    <Bg className="flex flex-col font-sans">
      <div className="p-4 bg-zinc-900 border-b border-white/10 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white uppercase tracking-widest text-xs">Remote Input</h1>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Session: {sessionId.substring(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-green-500">Connected</span>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <Scanner 
            onScan={(result) => {
              if (result && result.length > 0) {
                handleScan(result[0].rawValue);
              }
            }} 
            formats={['qr_code']}
            styles={{
              container: { width: '100%', height: '100%' },
              video: { width: '100%', height: '100%', objectFit: 'cover' }
            }}
          />
        </div>

        {/* Framing guide overlay */}
        <div className="absolute inset-0 z-1 pointer-events-none flex flex-col">
           <div className="flex-1 bg-black/40 backdrop-blur-[2px]" />
           <div className="flex z-10 h-[250px]">
              <div className="flex-1 bg-black/40 backdrop-blur-[2px]" />
              <div className="w-[250px] relative">
                 {/* Corner markers */}
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-xl" />
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-xl" />
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-xl" />
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-xl" />
              </div>
              <div className="flex-1 bg-black/40 backdrop-blur-[2px]" />
           </div>
           <div className="flex-1 bg-black/40 backdrop-blur-[2px]">
              <p className="text-center text-white/50 text-xs font-bold tracking-widest uppercase mt-8 animate-pulse">
                Position QR code within frame
              </p>
           </div>
        </div>

        {lastScanned && !error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-12 left-6 right-6 z-20 bg-green-500/20 border border-green-500/50 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-center gap-3 shadow-2xl shadow-green-500/20"
          >
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <span className="text-green-100 font-bold tracking-widest uppercase text-sm">Transmitted to Host</span>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-12 left-6 right-6 z-20 bg-red-500/20 border border-red-500/50 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-center gap-3 shadow-2xl shadow-red-500/20"
          >
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="text-red-100 font-bold tracking-widest uppercase text-sm">{error}</span>
          </motion.div>
        )}
      </div>
    </Bg>
  );
}
