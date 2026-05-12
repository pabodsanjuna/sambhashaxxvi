import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, Users, Layers, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    schools: 0,
    contestants: 0,
    categories: 0
  });
  const [recentSchools, setRecentSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [schoolsRes, contestantsRes, categoriesRes, recentSchoolsRes] = await Promise.all([
          supabase.from('school_details').select('*', { count: 'exact', head: true }),
          supabase.from('contestants').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('school_details').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          schools: schoolsRes.count || 0,
          contestants: contestantsRes.count || 0,
          categories: categoriesRes.count || 0
        });
        
        if (recentSchoolsRes.data) {
          setRecentSchools(recentSchoolsRes.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-10 text-white">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Registered Schools', value: stats.schools, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Registered Contestants', value: stats.contestants, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Competition Categories', value: stats.categories, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-black text-white mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400 text-sm font-medium">High-level system metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/[0.07] transition-all"
          >
             <div>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-white">{stat.value}</p>
             </div>
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
               <stat.icon className={`w-7 h-7 ${stat.color}`} />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
           <h2 className="text-lg font-bold text-white tracking-tight">Recently Registered Schools</h2>
           <button 
              onClick={() => navigate('/admin/schools')}
              className="text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-orange-400"
           >
              View All
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-6">School Details</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Master In Charge</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Coordinator</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentSchools.map((school) => (
                <tr 
                  key={school.id} 
                  onClick={() => navigate(`/admin/schools/${school.id}`)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-base">{school.school_name}</p>
                    <p className="text-sm font-mono text-zinc-500 mt-1">ID: {school.school_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-zinc-300">{school.mic_name || 'Not mapped'}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">{school.mic_phone || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-zinc-300">{school.coordinator_name || 'Not mapped'}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-1">{school.coordinator_phone || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                     </div>
                  </td>
                </tr>
              ))}
              {recentSchools.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">No schools registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
