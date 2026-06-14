import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Search, Filter, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { exportAdminCategoryContestantsAsPDF } from './utils/pdfExport';

export function AdminContestants() {
  const [contestants, setContestants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [rawCategories, setRawCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAll() {
      const { data: catData } = await supabase.from('categories').select('id, name, age_group');
      const catMap: Record<string, string> = {};
      catData?.forEach(c => {
         catMap[c.id] = `${c.name} - ${c.age_group}`;
      });
      setCategories(catMap);
      setRawCategories(catData || []);

      const { data, error } = await supabase
        .from('contestants')
        .select(`
          *,
          school_details ( school_name, school_id ),
          categories ( name, age_group )
        `)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setContestants(data);
      }
      setLoading(false);
    }
    fetchAll();
  }, []);

  const handleExport = () => {
    // Generate simple flat dataset for export
    const exportData = filtered.map(c => ({
      'Contestant ID': c.contestant_id,
      'Name': c.name,
      'Date of Birth': c.dob,
      'Category': categories[c.category_id] || c.category_id,
      'School Name': c.school_details?.school_name,
      'School ID': c.school_details?.school_id,
      'Status': c.status,
      'Registered At': new Date(c.created_at).toLocaleString(),
      'Attended': c.is_attended ? 'Yes' : 'No'
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sambhasha_All_Contestants_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    const cat = categoryFilter ? rawCategories.find(c => c.id === categoryFilter) : null;
    await exportAdminCategoryContestantsAsPDF(cat, filtered);
  };

  const filtered = contestants.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || 
                          c.contestant_id?.toLowerCase().includes(search.toLowerCase()) ||
                          c.school_details?.school_name?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === '' || c.category_id === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 md:p-12 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Global Contestant Data</h1>
          <p className="text-zinc-400 text-sm font-medium">Master list of all registered participants.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleExport}
            className="h-10 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="h-10 px-6 rounded-xl bg-white text-black hover:bg-white text-black text-sm font-bold shadow-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by name, ID, or school..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
        <div className="relative w-full sm:w-64">
           <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
           <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none"
           >
              <option value="" className="bg-zinc-900">All Categories</option>
              {Object.entries(categories).map(([id, name]) => (
                 <option key={id} value={id} className="bg-zinc-900">{name}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative z-0">
        {loading ? (
          <div className="p-10 text-center text-zinc-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-6">Contestant</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">DOB</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Mobile Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">NIC</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">School</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{c.name}</p>
                      <p className="text-xs font-mono text-zinc-500 mt-1">ID: {c.contestant_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-zinc-400">{new Date(c.dob).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-zinc-400">{c.mobile || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-zinc-400">{c.nic || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-300 text-sm max-w-[200px] truncate">{c.school_details?.school_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {c.categories?.name}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">No contestants match your search.</td>
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
