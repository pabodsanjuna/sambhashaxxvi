import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';

import { ActionBar } from './components/Dashboard/ActionBar';
const ContestantsTable = lazy(() => import('./components/Dashboard/ContestantsTable').then(m => ({ default: m.ContestantsTable })));

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
    const schoolNameStr = schoolDetails?.school_name ? schoolDetails.school_name.replace(/\s+/g, '_') : 'school_name';
    const schoolIdStr = schoolDetails?.school_id || 'school_id';
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `${schoolNameStr}_${schoolIdStr}_sambhashaxxvi_contestant_list_[${dateStr}].csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Action Bar */}
      <ActionBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
      />
      
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

        <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 flex items-center justify-center text-zinc-500">Loading Table...</div>}>
          <ContestantsTable 
            filteredContestants={filteredContestants} 
            searchQuery={searchQuery} 
          />
        </Suspense>
      </div>

    </div>
  );
}
