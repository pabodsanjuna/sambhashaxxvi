import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Download, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import { exportContestantsAsCSV } from './utils/csvExport';
import { exportContestantsAsPDF } from './utils/pdfExport';

export function AdminSchoolDetails() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState<any>(null);
  const [contestants, setContestants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportAsCSV = () => {
    setIsExportDropdownOpen(false);
    exportContestantsAsCSV(school, contestants);
  };

  const exportAsPDF = async () => {
    setIsExportDropdownOpen(false);
    await exportContestantsAsPDF(school, contestants);
  };

  // Modal State for edit/add
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentContestant, setCurrentContestant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', dob: '', nic: '', mobile: '', category_id: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!schoolId) return;
      const [schoolRes, contRes, catRes] = await Promise.all([
        supabase.from('school_details').select('*').eq('id', schoolId).single(),
        supabase.from('contestants').select('*, categories(name, age_group)').eq('school_details_id', schoolId).order('created_at', { ascending: true }),
        supabase.from('categories').select('*').order('name')
      ]);

      if (schoolRes.data) setSchool(schoolRes.data);
      if (contRes.data) setContestants(contRes.data);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    }
    fetchData();
  }, [schoolId]);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', dob: '', nic: '', mobile: '', category_id: '' });
    setCurrentContestant(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setModalMode('edit');
    setCurrentContestant(c);
    setFormData({ 
      name: c.name, 
      dob: new Date(c.dob).toISOString().split('T')[0], 
      category_id: c.category_id,
      nic: c.nic || '',
      mobile: c.mobile || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        const { data: generatedId, error: rpcError } = await supabase.rpc('generate_contestant_id', {
          p_category_id: formData.category_id
        });
        if (rpcError) throw rpcError;

        const { error } = await supabase
          .from('contestants')
          .insert({
            school_details_id: schoolId,
            name: formData.name,
            dob: formData.dob,
            category_id: formData.category_id,
            contestant_id: generatedId,
            nic: formData.nic,
            mobile: formData.mobile
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contestants')
          .update({
            name: formData.name,
            dob: formData.dob,
            category_id: formData.category_id,
            nic: formData.nic,
            mobile: formData.mobile
          })
          .eq('id', currentContestant.id);
        if (error) throw error;
      }
      
      // Reload contestants
      const { data } = await supabase.from('contestants').select('*, categories(name, age_group)').eq('school_details_id', schoolId).order('created_at', { ascending: true });
      if (data) setContestants(data);
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!school) return <div className="p-10 text-white">School not found.</div>;

  return (
    <div className="p-6 md:p-12 space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/admin/schools')}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Schools
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">{school.school_name}</h1>
          <p className="text-zinc-400 text-sm font-mono">ID: {school.school_id} • City: {school.city}</p>
        </div>
        <div className="flex items-center gap-4">
           <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Contestants</p>
              <div className="text-2xl font-black text-white font-mono">{contestants.length}</div>
           </div>
           <div className="w-px h-10 bg-white/10 hidden md:block"></div>
           
           <div className="relative" ref={dropdownRef}>
             <button 
               onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
               className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 transition-all flex items-center justify-center gap-2 shrink-0"
             >
               <Download className="w-4 h-4" /> Export
               <ChevronDown className={`w-4 h-4 transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
             </button>
             
             {isExportDropdownOpen && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                 <button 
                   onClick={exportAsCSV}
                   className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors text-left"
                 >
                   <FileSpreadsheet className="w-4 h-4 text-green-400" />
                   Export as CSV
                 </button>
                 <button 
                   onClick={exportAsPDF}
                   className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors text-left border-t border-white/5"
                 >
                   <FileText className="w-4 h-4 text-red-400" />
                   Export as PDF
                 </button>
               </div>
             )}
           </div>

           <button 
             onClick={openAddModal}
             className="h-10 px-6 rounded-xl bg-white text-black hover:bg-white text-black text-sm font-bold shadow-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 shrink-0"
           >
             <Plus className="w-4 h-4" /> Add Contestant
           </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col md:flex-row gap-4 items-center">
           <input 
              type="text" 
              placeholder="Search contestants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 h-10 bg-black border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-white/20"
           />
           <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-48 h-10 bg-black border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-white/20 appearance-none"
           >
              <option value="">All Categories</option>
              {categories.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
              ))}
           </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest pl-6">Contestant Name</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">DOB</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">NIC</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Mobile</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contestants.filter(c => {
                 const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     c.contestant_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     (c.categories?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
                 const matchesCat = filterCategory ? c.category_id === filterCategory : true;
                 return matchesSearch && matchesCat;
              }).map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{c.name}</p>
                    <p className="text-xs font-mono text-zinc-500 mt-1">ID: {c.contestant_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                      {c.categories?.name} - {c.categories?.age_group}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-sm font-mono text-zinc-400">{new Date(c.dob).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-sm font-mono text-zinc-400">{c.nic || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-sm font-mono text-zinc-400">{c.mobile || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button
                        onClick={() => openEditModal(c)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors text-xs font-semibold"
                     >
                        <Edit2 className="w-3 h-3" /> Edit
                     </button>
                  </td>
                </tr>
              ))}
              {contestants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">No contestants registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
              {modalMode === 'add' ? 'Add Contestant (Override)' : 'Edit Contestant'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Full Name</label>
                 <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/20" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Date of Birth</label>
                 <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 [color-scheme:dark]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">NIC / Postal ID</label>
                    <input required type="text" value={formData.nic} onChange={e => setFormData({...formData, nic: e.target.value})} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 font-mono" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Mobile Number</label>
                    <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 font-mono" />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
                 <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-white/20 appearance-none">
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name} - {cat.age_group}</option>
                    ))}
                 </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white text-black font-bold text-sm transition-colors shadow-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
