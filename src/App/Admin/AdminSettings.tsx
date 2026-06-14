import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStaffProfile } from '../../hooks/useStaffProfile';

export function AdminSettings() {
  const { staffProfile } = useStaffProfile();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase.from('system_settings').select('*').limit(1).single();
      if (!error && data) {
        setSettings(data);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const toggleSetting = async (field: string, currentValue: boolean) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ [field]: !currentValue })
        .eq('id', settings.id);
      
      if (error) throw error;
      setSettings({ ...settings, [field]: !currentValue });
    } catch (err: any) {
      alert("Error updating settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-black text-white mb-2">System Settings</h1>
        <p className="text-zinc-400 text-sm font-medium">Control global competition state and access.</p>
      </div>

      <div className="max-w-xl space-y-6">
         {/* Admin Details section */}
         {staffProfile && (
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
             <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Your Admin Profile</h3>
             <div className="space-y-3">
                <div>
                   <p className="text-xs text-zinc-500 font-medium">Name</p>
                   <p className="text-white font-bold">{staffProfile.name}</p>
                </div>
                <div>
                   <p className="text-xs text-zinc-500 font-medium">Email</p>
                   <p className="text-white font-bold">{staffProfile.email}</p>
                </div>
                <div>
                   <p className="text-xs text-zinc-500 font-medium">Position</p>
                   <p className="text-white font-bold">{staffProfile.position}</p>
                </div>
                <div>
                   <p className="text-xs text-zinc-500 font-medium">Mobile</p>
                   <p className="text-white font-bold font-mono">{staffProfile.mobile}</p>
                </div>
             </div>
           </div>
         )}

         {/* Setting 1 */}
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
               <h3 className="text-lg font-bold text-white mb-1">School Registration</h3>
               <p className="text-sm text-zinc-400 font-medium">Allows school coordinators to add contestants.</p>
            </div>
            <button 
               onClick={() => toggleSetting('registration_open', settings.registration_open)}
               disabled={isSaving}
               className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${settings.registration_open ? 'bg-white text-black' : 'bg-zinc-700'}`}
            >
               <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.registration_open ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
         </div>

         {/* Setting 2 */}
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
               <h3 className="text-lg font-bold text-white mb-1">Digital Submissions</h3>
               <p className="text-sm text-zinc-400 font-medium">Allows school coordinators to submit Drive links.</p>
            </div>
            <button 
               onClick={() => toggleSetting('submissions_open', settings.submissions_open)}
               disabled={isSaving}
               className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${settings.submissions_open ? 'bg-white text-black' : 'bg-zinc-700'}`}
            >
               <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.submissions_open ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
         </div>

         {/* Setting 3: submission_start */}
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
               <h3 className="text-lg font-bold text-white mb-1">Submissions Portal Access</h3>
               <p className="text-sm text-zinc-400 font-medium">Controls user access to the submissions portal.</p>
            </div>
            <button 
               onClick={() => toggleSetting('submission_start', settings.submission_start)}
               disabled={isSaving}
               className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${settings.submission_start ? 'bg-white text-black' : 'bg-zinc-700'}`}
            >
               <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.submission_start ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
         </div>
      </div>
    </div>
  );
}
