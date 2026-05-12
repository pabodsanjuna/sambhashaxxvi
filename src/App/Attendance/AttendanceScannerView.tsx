import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { MapPin, User, Phone, CheckCircle2, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { motion } from 'framer-motion';

export function AttendanceScannerView() {
  const { schoolId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [contestants, setContestants] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttendanceDetails() {
      if (!schoolId) {
        setError("Invalid School ID.");
        setLoading(false);
        return;
      }

      try {
        // Fetch school details
        const { data: school, error: schoolErr } = await supabase
          .from('school_details')
          .select('*')
          .eq('id', schoolId)
          .single();

        if (schoolErr || !school) {
          throw new Error("School details not found.");
        }
        setSchoolData(school);

        // Fetch contestants
        const { data: contestantsData, error: contestantsErr } = await supabase
          .from('contestants')
          .select(`
            id,
            name,
            contestant_id,
            categories(name, age_group),
            is_attended,
            attendance_time
          `)
          .eq('school_details_id', schoolId)
          .order('created_at', { ascending: true });

        if (!contestantsErr && contestantsData) {
          setContestants(contestantsData);
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load school details.');
      } finally {
        setLoading(false);
      }
    }

    fetchAttendanceDetails();
  }, [schoolId]);

  const toggleSchoolAttendance = async () => {
    if (!schoolData) return;
    setUpdatingId('school');
    try {
      const newValue = !schoolData.attendance_marked;
      const { error } = await supabase
        .from('school_details')
        .update({ 
          attendance_marked: newValue, 
          attendance_time: newValue ? new Date().toISOString() : null 
        })
        .eq('id', schoolId);
      
      if (error) throw error;
      setSchoolData({ ...schoolData, attendance_marked: newValue });
    } catch (err: any) {
      console.error(err);
      alert('Failed to update school attendance.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleContestantAttendance = async (id: string, currentValue: boolean) => {
    setUpdatingId(id);
    try {
      const newValue = !currentValue;
      const { error } = await supabase
        .from('contestants')
        .update({ 
          is_attended: newValue, 
          attendance_time: newValue ? new Date().toISOString() : null 
        })
        .eq('id', id);
      
      if (error) throw error;
      setContestants(contestants.map(c => 
        c.id === id ? { ...c, is_attended: newValue } : c
      ));
    } catch (err: any) {
      console.error(err);
      alert('Failed to update contestant attendance.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !schoolData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Error Loading Details</h1>
        <p className="text-zinc-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header - Verified Badge */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10 relative">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-green-500 uppercase tracking-widest mb-2">Verified Pass</h1>
            <h2 className="text-3xl font-black">{schoolData.school_name}</h2>
            <div className="flex items-center justify-center gap-2 text-zinc-400 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{schoolData.city}</span>
            </div>
            <p className="text-zinc-500 font-mono mt-2">School ID: {schoolData.school_id}</p>
          </div>

          <div className="mt-6 pt-4 w-full max-w-sm">
             <button
                onClick={toggleSchoolAttendance}
                disabled={updatingId === 'school'}
                className={`w-full h-14 rounded-2xl flex items-center justify-center font-bold text-sm uppercase tracking-widest transition-all ${
                  schoolData.attendance_marked 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30' 
                    : 'bg-white text-black hover:bg-zinc-200'
                } disabled:opacity-50`}
             >
                {updatingId === 'school' ? 'Updating...' : (schoolData.attendance_marked ? 'School Present' : 'Mark School Present')}
             </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Master In Charge</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-zinc-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">{schoolData.mic_name || 'Not provided'}</p>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Phone className="w-3 h-3" />
                  <span className="font-mono">{schoolData.mic_phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">General Coordinator</h3>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-zinc-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">{schoolData.coordinator_name || 'Not provided'}</p>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Phone className="w-3 h-3" />
                  <span className="font-mono">{schoolData.coordinator_phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contestants List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-8">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-lg font-bold">Registered Contestants</h3>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold">
              {contestants.filter(c => c.is_attended).length} / {contestants.length} Present
            </span>
          </div>
          
          <div className="p-0">
            {contestants.length === 0 ? (
              <div className="p-10 text-center text-zinc-500 italic">No contestants registered</div>
            ) : (
              <div className="divide-y divide-white/5">
                {contestants.map((c, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-white/[0.02] transition-colors gap-4"
                  >
                    <div>
                      <p className="font-bold text-lg">{c.name}</p>
                      <p className="text-sm font-semibold text-orange-400 mt-1 uppercase tracking-wider text-[10px]">
                        {c.categories?.name} - {c.categories?.age_group}
                      </p>
                       <p className="font-mono font-bold text-zinc-500 text-xs mt-2">ID: {c.contestant_id}</p>
                    </div>
                    <div className="sm:text-right shrink-0">
                       <button
                          onClick={() => toggleContestantAttendance(c.id, c.is_attended)}
                          disabled={updatingId === c.id}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                            c.is_attended 
                              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                              : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'
                          } disabled:opacity-50`}
                       >
                          {c.is_attended ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          {updatingId === c.id ? '...' : (c.is_attended ? 'Present' : 'Absent')}
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-8">
           <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Sambhasha XXVI Official Registration System</p>
        </div>
      </div>
    </div>
  );
}
