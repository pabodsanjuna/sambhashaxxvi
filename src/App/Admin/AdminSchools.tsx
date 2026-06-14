import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

export function AdminSchools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSchools() {
      const { data, error } = await supabase
        .from('school_details')
        .select('*')
        .order('school_name', { ascending: true });
      if (!error && data) {
        setSchools(data);
      }
      setLoading(false);
    }
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter(s => 
    s.school_name?.toLowerCase().includes(search.toLowerCase()) || 
    s.school_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-4xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">School Management</h1>
          <p className="text-zinc-400 text-sm font-medium">Manage registered schools and coordinate participants.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search schools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-zinc-500">Loading schools...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-6">School Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Master In Charge</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Coordinator</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSchools.map((school) => (
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
                       <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-zinc-400 group-hover:bg-white text-black group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredSchools.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">No schools found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
