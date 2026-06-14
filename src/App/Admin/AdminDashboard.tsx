import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Users, Layers, ChevronRight, Activity, 
  ArrowUpRight, Trophy, Sparkles, MapPin, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    schools: 0,
    contestants: 0,
    categories: 0
  });
  const [recentSchools, setRecentSchools] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          schoolsRes, 
          contestantsRes, 
          categoriesRes, 
          recentSchoolsRes,
          allContestantsRes
        ] = await Promise.all([
          supabase.from('school_details').select('id', { count: 'exact', head: true }),
          supabase.from('contestants').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('*'),
          supabase.from('school_details').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('contestants').select('category_id')
        ]);

        setStats({
          schools: schoolsRes.count || 0,
          contestants: contestantsRes.count || 0,
          categories: categoriesRes.data?.length || 0
        });
        
        if (recentSchoolsRes.data) {
          setRecentSchools(recentSchoolsRes.data);
        }

        if (categoriesRes.data && allContestantsRes.data) {
          const counts: Record<string, number> = {};
          allContestantsRes.data.forEach((c: any) => {
             counts[c.category_id] = (counts[c.category_id] || 0) + 1;
          });
          const cData = categoriesRes.data.map((cat: any) => ({
             name: cat.name,
             shortName: cat.name.split(' ')[0] + (cat.age_group ? ` ${cat.age_group.charAt(0)}` : ''),
             value: counts[cat.id] || 0
          })).filter(c => c.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);
          
          setChartData(cData);
        }

      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="flex flex-col items-center gap-4 text-white">
            <Activity className="w-8 h-8 animate-pulse" />
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
         </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Participating Schools', value: stats.schools, icon: Building2, color: 'text-white', border: 'group-hover:border-white/20', glow: 'group-hover:shadow-md' },
    { label: 'Registered Contestants', value: stats.contestants, icon: Users, color: 'text-white', border: 'group-hover:border-white/20', glow: 'group-hover:shadow-md' },
    { label: 'Active Categories', value: stats.categories, icon: Layers, color: 'text-white', border: 'group-hover:border-white/20', glow: 'group-hover:shadow-md' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Overview</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">System <span className=" bg-white text-black">Dashboard</span></h1>
           <p className="text-zinc-400 text-base">Comprehensive control center for SAMBHASHA XXVI operations.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate('/admin/settings')}
             className="h-10 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
           >
              System Settings
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-6 rounded-[2rem] bg-[#222222] border border-white/5 flex flex-col justify-between overflow-hidden group transition-all duration-500 ${stat.border} ${stat.glow}`}
          >
             {/* Decorative Background Blob */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-all duration-500"></div>

             <div className="flex items-start justify-between mb-8 z-10 relative">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/[0.05] group-hover:scale-110 transition-transform duration-500`}>
                 <stat.icon className={`w-6 h-6 outline-none ${stat.color}`} />
               </div>
               <Activity className="w-5 h-5 text-zinc-600 opacity-50" />
             </div>
             
             <div className="z-10 relative">
                <p className="text-4xl font-black text-white tracking-tight mb-1">{stat.value.toLocaleString()}</p>
                <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Section: Chart & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart Panel */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 p-6 md:p-8 rounded-[2rem] bg-[#222222] border border-white/5 relative overflow-hidden flex flex-col"
         >
            <div className="flex items-center justify-between mb-8">
               <div>
                 <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-white" />
                    Top Categories by Registration
                 </h2>
                 <p className="text-sm text-zinc-500 mt-1">Distribution of contestants across the most popular events.</p>
               </div>
            </div>
            
            <div className="flex-1 min-h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                   />
                   <XAxis 
                      dataKey="shortName" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }} 
                      dy={10}
                   />
                   <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717a', fontSize: 12 }} 
                   />
                   <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ffffff' : '#3f3f46'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* Quick Links / Actions Panel */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-[2rem] bg-[#222222] border border-white/20 flex flex-col"
         >
            <h2 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
               <Zap className="w-5 h-5 text-white" />
               Quick Operations
            </h2>

            <div className="space-y-3 flex-1">
               <button 
                  onClick={() => navigate('/admin/schools')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
               >
                  <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors text-sm font-semibold">
                     <Building2 className="w-4 h-4" />
                     Manage Schools
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
               </button>
               <button 
                  onClick={() => navigate('/admin/contestants')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
               >
                  <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors text-sm font-semibold">
                     <Users className="w-4 h-4" />
                     View All Contestants
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
               </button>
               <button 
                  onClick={() => navigate('/admin/submissions')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
               >
                  <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors text-sm font-semibold">
                     <Layers className="w-4 h-4" />
                     Review Submissions
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
               </button>
            </div>
         </motion.div>
      </div>

      {/* Bottom Row: Recent Schools Table */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
         className="bg-[#222222] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col"
      >
         <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
            <div>
               <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-white" />
                  Latest Registrations
               </h2>
               <p className="text-sm text-zinc-500 mt-1">The most recently onboarded schools into the platform.</p>
            </div>
            <button 
               onClick={() => navigate('/admin/schools')}
               className="text-xs font-bold uppercase tracking-widest text-white hover:text-white flex items-center gap-1"
            >
               View All <ChevronRight className="w-4 h-4" />
            </button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="bg-white/[0.02]">
                     <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">School Information</th>
                     <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Master In Charge</th>
                     <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Zone / City</th>
                     <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 text-right flex-1">Registration Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {recentSchools.map((school) => (
                     <tr 
                        key={school.id} 
                        onClick={() => navigate(`/admin/schools/${school.id}`)}
                        className="hover:bg-white/[0.04] cursor-pointer transition-colors group"
                     >
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                 {school.school_logo_url ? (
                                    <img src={school.school_logo_url} alt="Logo" className="w-full h-full rounded-full object-cover" />
                                 ) : (
                                    <Building2 className="w-5 h-5 text-zinc-500" />
                                 )}
                              </div>
                              <div>
                                 <p className="font-bold text-white text-base group-hover:text-white transition-colors">{school.school_name || 'Unnamed School'}</p>
                                 <p className="text-xs font-mono text-zinc-500 mt-1">ID: {school.school_id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <p className="font-semibold text-zinc-300">{school.mic_name || 'Not specified'}</p>
                           <p className="text-xs text-zinc-500 font-mono mt-1">{school.mic_phone || '-------'}</p>
                        </td>
                        <td className="px-8 py-5">
                           <p className="font-semibold text-zinc-300 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-zinc-500" /> 
                              {school.city || 'Unknown City'}
                           </p>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <p className="text-sm text-zinc-400">
                              {new Date(school.created_at).toLocaleDateString('en-GB', {
                                 day: 'numeric', month: 'short', year: 'numeric'
                              })}
                           </p>
                           <p className="text-xs text-zinc-600 mt-0.5">
                              {new Date(school.created_at).toLocaleTimeString('en-GB', {
                                 hour: '2-digit', minute: '2-digit'
                              })}
                           </p>
                        </td>
                     </tr>
                  ))}
                  {recentSchools.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-8 py-16 text-center">
                           <div className="flex flex-col items-center justify-center text-zinc-500">
                              <Building2 className="w-10 h-10 mb-3 opacity-20" />
                              <p className="italic">No schools have registered yet.</p>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </motion.div>
    </div>
  );
}

