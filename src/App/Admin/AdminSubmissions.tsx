import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Link as LinkIcon, Edit2, Trash2, ExternalLink, X, Save } from 'lucide-react';

export function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLink, setEditLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        school_details ( school_name, school_id ),
        categories ( name, age_group ),
        contestants ( name, contestant_id )
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setSubmissions(data);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('submissions').delete().eq('id', id);
      if (error) throw error;
      setSubmissions(submissions.filter(s => s.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      setErrorMsg("Failed to delete: " + err.message);
    }
  };

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setEditLink(sub.link);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLink('');
  };

  const saveEdit = async (id: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ link: editLink })
        .eq('id', id);
      
      if (error) throw error;
      
      setSubmissions(submissions.map(s => s.id === id ? { ...s, link: editLink } : s));
      setEditingId(null);
    } catch (err: any) {
      setErrorMsg("Failed to update: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = submissions.filter(s => {
    const matchesSearch = 
      s.contestants?.name?.toLowerCase().includes(search.toLowerCase()) || 
      s.contestants?.contestant_id?.toLowerCase().includes(search.toLowerCase()) ||
      s.school_details?.school_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.categories?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-12 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Manage Submissions</h1>
          <p className="text-zinc-400 text-sm font-medium">View and review all digital entries.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by name, category, or school..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 block"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative z-10 backdrop-blur-sm max-w-7xl">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-10 text-center text-zinc-500 animate-pulse font-medium">Loading submissions...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Contestant</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">School</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Category</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500 w-2/5">Submission Link</th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest font-bold text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No submissions found matching your search.
                     </td>
                   </tr>
                ) : (
                  filtered.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm">{sub.contestants?.name || 'Unknown'}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{sub.contestants?.contestant_id || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-zinc-300">{sub.school_details?.school_name || 'Unknown'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-xs font-medium">
                          {sub.categories?.name}
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">{sub.categories?.age_group}</p>
                      </td>
                      <td className="px-6 py-4">
                         {editingId === sub.id ? (
                           <div className="flex items-center gap-2">
                             <input 
                               type="url"
                               value={editLink}
                               onChange={(e) => setEditLink(e.target.value)}
                               className="flex-1 h-9 bg-black/50 border border-white/20 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-orange-500"
                             />
                             <button 
                               onClick={() => saveEdit(sub.id)} 
                               disabled={isSaving}
                               className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors cursor-pointer"
                             >
                               <Save className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={cancelEdit}
                               className="p-2 text-zinc-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                             >
                               <X className="w-4 h-4" />
                             </button>
                           </div>
                         ) : (
                           <a 
                             href={sub.link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors w-full break-all"
                           >
                             <span className="line-clamp-2">{sub.link}</span>
                             <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                           </a>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            title="Edit Link"
                            onClick={() => startEdit(sub)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            title="Delete Submission"
                            onClick={() => setDeleteConfirmId(sub.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden text-center">
               <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Delete Submission?</h3>
               <p className="text-sm text-zinc-400 mb-6">This action cannot be undone. You are about to permanently delete this submission.</p>
               <div className="flex gap-3">
                  <button 
                     onClick={() => setDeleteConfirmId(null)}
                     className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     onClick={() => handleDelete(deleteConfirmId)}
                     className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                     Delete
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Error Modal */}
      {errorMsg && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden text-center">
               <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Error</h3>
               <p className="text-sm text-zinc-400 mb-6">{errorMsg}</p>
               <button 
                  onClick={() => setErrorMsg(null)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors"
               >
                  Close
               </button>
            </div>
         </div>
      )}
    </div>
  );
}
