import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';

export interface SchoolDetails {
  id: string;
  user_id: string;
  school_name: string;
  school_id: string;
  city: string;
  address: string;
  phone: string;
  mic_name: string;
  mic_phone: string;
  coordinator_name: string;
  coordinator_phone: string;
  school_logo_url?: string;
  media_logo_url?: string;
}

export function useSchoolDetails() {
  const { user, isLoaded } = useUser();
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      setSchoolDetails(null);
      setLoading(false);
      return;
    }

    async function fetchSchoolDetails() {
      try {
        const { data, error } = await supabase
          .from('school_details')
          .select('*')
          .eq('user_id', user!.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 means zero rows found
            console.error('Error fetching school details:', error);
          }
          setSchoolDetails(null);
        } else {
          setSchoolDetails(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolDetails();
  }, [user, isLoaded]);

  return { schoolDetails, loading };
}
