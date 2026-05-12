import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, CheckCircle2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export function AttendanceDashboard() {
  const [stats, setStats] = useState({ expected: 0, attended: 0, walkIns: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // In a real optimized app, you'd use raw SQL or counts, but for now we'll fetch basic metrics.
      // Expected: All contestants
      // Attended: is_attended = true
      // WalkIns: is_walk_in = true

      try {
         const [allRes, attendedRes, walkInRes] = await Promise.all([
           supabase.from('contestants').select('*', { count: 'exact', head: true }),
           supabase.from('contestants').select('*', { count: 'exact', head: true }).eq('is_attended', true),
           supabase.from('contestants').select('*', { count: 'exact', head: true }).eq('is_walk_in', true)
         ]);

         setStats({
            expected: allRes.count || 0,
            attended: attendedRes.count || 0,
            walkIns: walkInRes.count || 0
         });
      } catch(err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
    }
    
    load();
    const interval = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-zinc-500">Loading metrics...</div>;

  const cards = [
    { label: 'Total Expected', value: stats.expected, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Attended', value: stats.attended, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Total Walk-ins', value: stats.walkIns, icon: UserPlus, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  ];

  return (
     <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-300">
        <div>
           <h2 className="text-2xl font-black mt-2">Live Metrics</h2>
           <p className="text-sm text-zinc-400 mt-1">Real-time attendance overview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {cards.map((c, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`p-6 md:p-8 rounded-3xl border ${c.bg} flex items-center justify-between backdrop-blur-sm relative overflow-hidden`}
             >
                {/* Decorative background glow */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 bg-current ${c.color}`} />
                <div className="relative z-10">
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{c.label}</p>
                   <p className="text-5xl font-black">{c.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-md relative z-10 shrink-0`}>
                   <c.icon className={`w-7 h-7 ${c.color}`} />
                </div>
             </motion.div>
           ))}
        </div>
     </div>
  );
}
