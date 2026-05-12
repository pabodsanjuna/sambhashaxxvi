import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';

export function useStaffProfile() {
  const { isLoaded, user } = useUser();
  const [staffProfile, setStaffProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setStaffProfile(data || null);
      setLoading(false);
    }
    
    load();
  }, [isLoaded, user]);

  return { staffProfile, loading, isLoaded };
}
