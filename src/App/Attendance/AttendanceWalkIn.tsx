import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function AttendanceWalkIn() {
  const [schools, setSchools] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isNewSchool, setIsNewSchool] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    school_id: '',
    new_school_name: '',
    category_id: ''
  });

  useEffect(() => {
    async function fetchFormOptions() {
      const [schoolsRes, categoriesRes] = await Promise.all([
        supabase.from('school_details').select('id, school_name').order('school_name', { ascending: true }),
        supabase.from('categories').select('id, name, age_group').order('name', { ascending: true })
      ]);
      if (schoolsRes.data) setSchools(schoolsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      setLoading(false);
    }
    fetchFormOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      let finalSchoolId = formData.school_id;

      // Handle new school creation
      if (isNewSchool) {
        if (!formData.new_school_name.trim()) {
          throw new Error("Please enter a school name.");
        }
        
        const { data: generatedSchoolId, error: rpcError } = await supabase.rpc('generate_school_id');
        if (rpcError) throw rpcError;

        const { data: newSchool, error: schoolErr } = await supabase
          .from('school_details')
          .insert({
            school_name: formData.new_school_name.trim(),
            school_id: generatedSchoolId,
            city: 'Walk-In',
            address: 'Walk-In Registration',
            coordinator_name: 'Walk-In Coordinator',
            coordinator_phone: 'N/A',
            mic_name: 'Walk-In MIC',
            mic_phone: 'N/A'
          })
          .select()
          .single();

        if (schoolErr) throw schoolErr;
        finalSchoolId = newSchool.id;
        
        // Add to local state so it appears in dropdown later if they switch back
        setSchools(prev => [...prev, newSchool].sort((a, b) => a.school_name.localeCompare(b.school_name)));
      } else if (!finalSchoolId) {
        throw new Error("Please select a school.");
      }

      const { data: generatedId, error: rpcError2 } = await supabase.rpc('generate_contestant_id', {
        p_category_id: formData.category_id
      });
      if (rpcError2) throw rpcError2;

      // Insert and mark as attended and walk_in immediately
      const { error } = await supabase
        .from('contestants')
        .insert({
          name: formData.name,
          school_details_id: finalSchoolId,
          category_id: formData.category_id,
          contestant_id: generatedId,
          is_attended: true,
          attendance_time: new Date().toISOString(),
          is_walk_in: true,
          dob: '1970-01-01' // Dummy date for walk-ins if required by DB. Ideally update schema to allow nulls if needed, or ask. Assuming non-strict for walkin.
        });

      if (error) throw error;
      
      setSuccess(true);
      setFormData({ name: '', school_id: finalSchoolId, new_school_name: '', category_id: '' });
      setIsNewSchool(false); // Reset to dropdown to avoid creating duplicate schools easily
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Error saving walk-in: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-zinc-500">Loading form...</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in fade-in duration-300">
       <div className="mb-6 px-2 text-center md:text-left">
          <h2 className="text-2xl font-black mb-1 mt-2">Walk-in Registration</h2>
          <p className="text-sm text-zinc-400">Register and mark present instantly for unannounced arrivals.</p>
       </div>

       <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 p-5 rounded-3xl space-y-5">
         <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Contestant Name</label>
            <input 
               required 
               type="text" 
               placeholder="Full Name"
               value={formData.name} 
               onChange={e => setFormData({...formData, name: e.target.value})} 
               className="w-full h-14 bg-black border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:border-orange-500" 
            />
         </div>

         <div>
            <div className="flex items-center justify-between mb-1.5">
               <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">School</label>
               <button 
                  type="button" 
                  onClick={() => setIsNewSchool(!isNewSchool)}
                  className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
               >
                  {isNewSchool ? 'Select Existing' : '+ New School'}
               </button>
            </div>
            
            {isNewSchool ? (
               <input 
                  required 
                  type="text" 
                  placeholder="Enter new school name"
                  value={formData.new_school_name} 
                  onChange={e => setFormData({...formData, new_school_name: e.target.value})} 
                  className="w-full h-14 bg-black border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:border-orange-500" 
               />
            ) : (
               <select 
                  required 
                  value={formData.school_id} 
                  onChange={e => setFormData({...formData, school_id: e.target.value})} 
                  className="w-full h-14 bg-black border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:border-orange-500 appearance-none bg-no-repeat" 
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
               >
                  <option value="" disabled className="bg-zinc-900">Select School...</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900">{s.school_name}</option>
                  ))}
               </select>
            )}
         </div>

         <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
            <select 
               required 
               value={formData.category_id} 
               onChange={e => setFormData({...formData, category_id: e.target.value})} 
               className="w-full h-14 bg-black border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:border-orange-500 appearance-none bg-no-repeat"
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
            >
               <option value="" disabled className="bg-zinc-900">Select Category...</option>
               {categories.map(c => (
                 <option key={c.id} value={c.id} className="bg-zinc-900">{c.name} - {c.age_group}</option>
               ))}
            </select>
         </div>

         <button 
           type="submit" 
           disabled={isSaving}
           className="w-full h-14 rounded-2xl bg-orange-600 font-bold text-sm hover:bg-orange-500 transition-colors mt-2"
         >
           {isSaving ? 'Registering...' : 'Register & Mark Present'}
         </button>

         {success && (
           <div className="text-center text-sm font-bold text-green-500 bg-green-500/10 p-3 rounded-xl mt-4">
             Contestant registered successfully!
           </div>
         )}
       </form>
    </div>
  );
}
