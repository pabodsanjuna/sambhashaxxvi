import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Contestant = {
  id: string;
  name: string;
  category: string;
  dob: string;
  mobile: string;
  nic: string;
};

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const { schoolDetails, loading } = useSchoolDetails();

  useEffect(() => {
    if (!schoolDetails) return;

    const fetchData = async () => {
      try {
        // Fetch Contestants and Categories separately since the FK might not be propagated
        const [ctResponse, catResponse] = await Promise.all([
          supabase.from('contestants').select('*').eq('school_details_id', schoolDetails.id),
          supabase.from('categories').select('id, name, age_group')
        ]);
          
        if (ctResponse.error) {
           console.error("Fetch contestants error:", ctResponse.error);
        }
          
        if (!ctResponse.error && ctResponse.data) {
          // Create category map for quick lookup
          const catMap = new Map();
          if (catResponse.data) {
            catResponse.data.forEach((c: any) => {
              catMap.set(c.id, c);
            });
            const allCatNames = catResponse.data.map((c: any) => `${c.name} - ${c.age_group}`);
            setAvailableCategories(Array.from(new Set(allCatNames)).sort());
          }

          const formatted = ctResponse.data.map((c: any) => {
            const cat = catMap.get(c.category_id);
            return {
              id: c.contestant_id,
              name: c.name,
              category: cat ? `${cat.name} - ${cat.age_group}` : c.category_id,
              dob: c.dob,
              mobile: c.mobile,
              nic: c.nic || '-'
            };
          });
          setContestants(formatted);

          if (!catResponse.data) {
            const uniqueCategories = Array.from(new Set(formatted.map((c: any) => c.category))) as string[];
            setAvailableCategories(uniqueCategories.sort());
          }
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, [schoolDetails]);

  const filteredContestants = contestants.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.nic || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const exportToCSV = () => {
    if (filteredContestants.length === 0) return;

    const headers = ['ID', 'Name', 'Category', 'DOB', 'NIC', 'Contact'];
    const csvContent = [
      headers.join(','),
      ...filteredContestants.map(c => 
        `"${c.id}","${c.name}","${c.category}","${c.dob}","${c.nic}","${c.mobile}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contestants_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, Name or NIC..." 
              className="w-full h-11 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/5 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-zinc-600 focus:bg-white/10"
            />
          </div>
          <div className="relative flex-shrink-0 min-w-[200px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="!h-11 px-4 flex items-center justify-between gap-2 rounded-2xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white/20 font-medium cursor-pointer w-full">
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-4 h-4 flex-shrink-0" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl text-white shadow-xl max-h-[300px]">
                <SelectItem value="All" className="focus:bg-white/10 focus:text-white py-3">All Categories</SelectItem>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="focus:bg-white/10 focus:text-white py-3">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Main Content: Contestants Table */}
      <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold">Contestants</h2>
            <p className="text-sm text-zinc-500 mt-1">Manage registration database</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3 flex-wrap justify-end">
             <Button onClick={exportToCSV} variant="outline" className="rounded-xl bg-white/5 border-white/5 hover:bg-white/10 text-xs text-zinc-400 border-zinc-800 h-10 px-5 transition-all">
                <Download className="w-4 h-4 mr-2" /> Export
             </Button>
             <Link to="/dashboard/add-contestant" className="inline-flex items-center justify-center rounded-xl bg-white text-black hover:bg-zinc-200 border-0 shadow-lg shadow-white/5 text-xs h-10 px-5 font-bold transition-all transform active:scale-95">
                Add Contestant
             </Link>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="border-b border-white/5">
                   <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">ID</th>
                   <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">Name</th>
                   <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">Category</th>
                   <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">DOB</th>
                   <th className="px-8 py-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">NIC</th>
                   <th className="px-8 py-4 text-right text-[10px] uppercase font-bold tracking-widest text-zinc-500">Contact</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-zinc-400 text-sm">
                {filteredContestants.length > 0 ? (
                  filteredContestants.map((c, idx) => (
                    <motion.tr 
                      key={c.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                        <td className="px-8 py-5 text-white font-mono">{c.id}</td>
                        <td className="px-8 py-5 text-white font-medium">{c.name}</td>
                        <td className="px-8 py-5 italic text-zinc-500">{c.category}</td>
                        <td className="px-8 py-5 text-white font-mono">{c.dob}</td>
                        <td className="px-8 py-5">{c.nic}</td>
                        <td className="px-8 py-5 text-right font-mono text-zinc-500">{c.mobile}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr className="border-t border-white/5">
                    <td colSpan={6} className="px-8 py-10 text-center text-zinc-600 italic">No contestants found matching "{searchQuery}"</td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-6 space-y-4">
           {filteredContestants.length > 0 ? (
             filteredContestants.map((c, idx) => (
              <motion.div 
                key={c.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-white/5 rounded-2xl p-5 border border-white/5 group active:bg-white/10 transition-colors space-y-4"
              >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white tracking-tight">{c.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded">{c.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">Category</div>
                      <div className="text-zinc-300 italic">{c.category}</div>
                    </div>
                    <div>
                      <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">Contact</div>
                      <div className="text-zinc-300 font-mono">{c.mobile}</div>
                    </div>
                    <div>
                      <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">DOB</div>
                      <div className="text-zinc-300 font-mono">{c.dob}</div>
                    </div>
                    <div>
                      <div className="text-zinc-600 mb-1 text-[10px] uppercase font-bold tracking-widest">NIC</div>
                      <div className="text-zinc-300 font-mono">{c.nic}</div>
                    </div>
                  </div>
              </motion.div>
             ))
           ) : (
               <div className="p-10 text-center text-zinc-600 italic">No contestants found</div>
           )}
        </div>
      </div>

    </div>
  );
}
