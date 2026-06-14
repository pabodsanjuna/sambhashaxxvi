import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Bg } from '@/components/Bg';

export function OnboardingSuccess() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // When back button is clicked or component unmounts, handle history push to dashboard
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      navigate('/dashboard', { replace: true });
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  useEffect(() => {
    let active = true;
    async function fetchSchoolId() {
       if (isLoaded && user) {
          const { data, error } = await supabase.from('school_details').select('school_id').eq('user_id', user.id).single();
          if (active) {
            if (data) {
               setSchoolId(data.school_id);
            } else {
               // Not found
               navigate('/onboarding', { replace: true });
            }
            setFetching(false);
          }
       }
    }
    fetchSchoolId();
    return () => { active = false; }
  }, [isLoaded, user, navigate]);

  const handleJoinWhatsApp = () => {
    window.open('https://chat.whatsapp.com/invite', '_blank');
  };

  const handleNavigateDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  if (fetching || !schoolId) {
    return <Bg className="flex items-center justify-center text-white font-sans">
        <div className="animate-pulse">Loading setup...</div>
    </Bg>;
  }

  return (
    <Bg className="flex flex-col relative text-white font-sans selection:bg-white selection:text-black overflow-hidden items-center justify-center">
      {/* Animated Mesh Background Elements */}
      <div className="mesh-blob mesh-brand-1 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-brand-2 fixed z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-xl mx-auto p-8 lg:p-12 text-center">
        <div className="mb-12">
            <CheckCircle className="w-20 h-20 text-brand-500 mx-auto drop-shadow-[0_0_15px_rgba(138,111,91,0.5)]" />
            <h1 className="font-[family-name:var(--font-modern)] tracking-tight font-bold text-3xl md:text-4xl text-white mt-8 mb-3">
               Successfully registered to SAMBHASHA XXVI
            </h1>
            <p className="text-xl font-medium text-zinc-300">
               Your School ID: <span className="font-mono bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-white ml-2">{schoolId}</span>
            </p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
            <button 
                onClick={handleJoinWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-[1rem] px-6 py-4 transition-all flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.25)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 group"
            >
                <span className="text-[17px] font-bold tracking-tight mb-1">Join WhatsApp Group</span>
                <span className="text-[11px] font-medium opacity-90 leading-tight px-2 group-hover:opacity-100 transition-opacity">To receive further information regarding the competitions, please join the coordinator group.</span>
            </button>
            <button 
                onClick={handleNavigateDashboard}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-[1rem] px-8 py-4 transition-colors"
             >
                Navigate to Dashboard
            </button>
        </div>
      </div>
    </Bg>
  );
}
