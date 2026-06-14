import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useStaffProfile } from '@/hooks/useStaffProfile';
import { ShieldCheck, LogOut } from 'lucide-react';
import { Bg } from '@/components/Bg';

export function StaffOnboarding() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { staffProfile, loading: profileLoading } = useStaffProfile();

  const [formData, setFormData] = useState({
    name: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    mobile: '',
    position: '',
    membership_id: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const role = (user?.publicMetadata?.role as string) || '';

  if (!isLoaded || profileLoading) {
    return <Bg className="flex items-center justify-center">Loading...</Bg>;
  }

  if (staffProfile) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'registrar') return <Navigate to="/attendance" replace />;
    return <Navigate to="/" replace />;
  }

  if (role !== 'admin' && role !== 'registrar') {
    // Standard user should not be here
    return <Navigate to="/" replace />;
  }

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('staff_profiles')
        .insert({
          id: user.id,
          role,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          position: role === 'admin' ? formData.position : null,
          membership_id: role === 'registrar' ? formData.membership_id : null
        });

      if (error) throw error;
      
      // Navigate to their respective portal
      if (role === 'admin') navigate('/admin');
      else navigate('/attendance');
      
    } catch (err: any) {
      alert("Error saving profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Bg className="selection:bg-brand-500/30 flex items-center justify-center p-6 relative">
       <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
             <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50">
               <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tight">Staff Registration</h1>
                <p className="text-zinc-400 text-sm font-medium">Complete your internal profile.</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
             <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                   Full Name <span className="text-brand-500 text-[10px]">*</span>
                </label>
                <input 
                   required
                   type="text" 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})} 
                   className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500" 
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                   Email Address <span className="text-brand-500 text-[10px]">*</span>
                </label>
                <input 
                   required
                   type="email" 
                   value={formData.email} 
                   onChange={e => setFormData({...formData, email: e.target.value})} 
                   className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 opacity-50 cursor-not-allowed" 
                   readOnly
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                   Mobile Number <span className="text-brand-500 text-[10px]">*</span>
                </label>
                <input 
                   required
                   type="tel" 
                   value={formData.mobile} 
                   onChange={e => setFormData({...formData, mobile: e.target.value})} 
                   className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500" 
                />
             </div>

             {role === 'admin' && (
               <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                     NCCU Board of Officials Position <span className="text-brand-500 text-[10px]">*</span>
                  </label>
                  <input 
                     required
                     type="text" 
                     placeholder="e.g. Director, Event Lead"
                     value={formData.position} 
                     onChange={e => setFormData({...formData, position: e.target.value})} 
                     className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500" 
                  />
               </div>
             )}

             {role === 'registrar' && (
               <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                     NCCU Membership ID <span className="text-brand-500 text-[10px]">*</span>
                  </label>
                  <input 
                     required
                     type="text" 
                     placeholder="e.g. NCCU-123456"
                     value={formData.membership_id} 
                     onChange={e => setFormData({...formData, membership_id: e.target.value})} 
                     className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-500 font-mono" 
                  />
               </div>
             )}

             <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={handleSignOut}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  title="Sign Out"
                >
                   <LogOut className="w-5 h-5 text-zinc-400" />
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 h-12 rounded-xl bg-brand-600 font-bold text-sm hover:bg-brand-500 transition-colors shadow-lg shadow-brand-900/20 disabled:opacity-50"
                >
                  {isSaving ? 'Saving Profile...' : 'Complete Registration'}
                </button>
             </div>
          </form>
       </div>
    </Bg>
  );
}
