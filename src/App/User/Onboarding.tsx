import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';
import { useSchoolDetails } from '@/hooks/useSchoolDetails';
import { Bg } from '@/components/Bg';

export function Onboarding() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { schoolDetails, loading } = useSchoolDetails();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [micName, setMicName] = useState('');
  const [micPhone, setMicPhone] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');
  
  // Image files
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null);
  const [mediaLogo, setMediaLogo] = useState<File | null>(null);

  useEffect(() => {
    if (isLoaded && user && !loading) {
      const role = (user.publicMetadata?.role as string) || '';
      
      if (role === 'admin' || role === 'registrar') {
         navigate('/staff-onboarding');
         return;
      }

      if (schoolDetails) {
        // User already has a school profile, redirect to dashboard
        navigate('/dashboard');
      }
    }
  }, [isLoaded, user, schoolDetails, loading, navigate]);

  const handleFileUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('school_logos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicURLData } = supabase.storage
      .from('school_logos')
      .getPublicUrl(filePath);

    return publicURLData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let schoolLogoUrl = null;
      let mediaLogoUrl = null;

      if (schoolLogo) {
        schoolLogoUrl = await handleFileUpload(schoolLogo, 'school-logo');
      }
      
      if (mediaLogo) {
        mediaLogoUrl = await handleFileUpload(mediaLogo, 'media-logo');
      }

      // Generate School ID
      const { data: generatedSchoolId, error: rpcError } = await supabase.rpc('generate_school_id');
      if (rpcError) throw rpcError;

      const { data: insertedRows, error } = await supabase.from('school_details').insert({
        user_id: user.id,
        school_name: schoolName,
        school_id: generatedSchoolId,
        city,
        address,
        phone,
        mic_name: micName,
        mic_phone: micPhone,
        coordinator_name: coordinatorName,
        coordinator_phone: coordinatorPhone,
        school_logo_url: schoolLogoUrl,
        media_logo_url: mediaLogoUrl,
        status: 'onboarded',
      }).select();

      if (error) {
        console.error('Error saving school details:', error);
        alert('Failed to save profile. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      if (insertedRows && insertedRows.length > 0) {
        const newSchool = insertedRows[0];
        await supabase.from('notifications').insert({
          school_details_id: newSchool.id,
          title: 'Account Setup Complete',
          message: 'Welcome to SAMBHASHA XXVI! Your school profile has been successfully registered.',
          is_read: false
        });

        navigate('/onboarding-success', { 
           replace: true, 
           state: { schoolId: newSchool.school_id } 
        });
      } else {
         navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert('An expected error occurred during upload. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Bg className="flex items-center justify-center text-white">Loading...</Bg>;
  }

  return (
    <Bg className="flex flex-col relative text-white font-sans selection:bg-white selection:text-black overflow-hidden">
      {/* Animated Mesh Background Elements */}
      <div className="mesh-blob mesh-brand-1 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-brand-2 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-brand-3 fixed z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20 flex-1 flex flex-col justify-center my-6">
        <div className="mb-8 text-center lg:text-left">
          <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-4">Step 2 of 2</p>
          <h1 className="font-[family-name:var(--font-modern)] tracking-[-0.04em] font-semibold text-4xl lg:text-5xl text-white mb-4">
            Complete your <br/><span className="text-zinc-400 font-normal">Profile Validation</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto lg:mx-0">
            Welcome to SAMBHASHA XXVI. Please provide your school details to complete the registration process. This information will be used for official communications and certifications.
          </p>
        </div>

        <div className="bg-transparent/10 backdrop-blur-md border-[1.5px] border-zinc-300 rounded-[2rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* subtle inner glow for silver effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] pointer-events-none rounded-[2rem]"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 w-full space-y-10">
          
          {/* Section: School Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-4">School Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">School Name</label>
                <input type="text" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="e.g. Royal College" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">City</label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="e.g. Colombo 07" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">Full Address</label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="e.g. Reid Avenue, Colombo 00700" />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">Official Phone Number</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="+94 11 234 5678" />
            </div>
          </div>

          {/* Section: Contact Persons */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Contact Personnel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">MIC Name (Master in Charge)</label>
                <input type="text" required value={micName} onChange={(e) => setMicName(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="Name of MIC" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">MIC Contact Number</label>
                <input type="tel" required value={micPhone} onChange={(e) => setMicPhone(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="Mobile number" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">Co-ordinator Name</label>
                <input type="text" required value={coordinatorName} onChange={(e) => setCoordinatorName(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="Name of Co-ordinator" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">Co-ordinator Contact Number</label>
                <input type="tel" required value={coordinatorPhone} onChange={(e) => setCoordinatorPhone(e.target.value)} className="input-field w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-0" placeholder="Mobile number" />
              </div>
            </div>
          </div>

          {/* Section: Assets */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Branding Assets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">School Logo</label>
                <div 
                  className={`border-dashed border rounded-[1rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden ${schoolLogo ? 'border-primary/50 bg-primary/5 py-4' : 'border-zinc-700 py-6'}`}
                  onClick={() => document.getElementById('school-logo')?.click()}
                >
                  {schoolLogo ? (
                    <div className="flex flex-col items-center text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <UploadCloud className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white truncate max-w-[200px]">{schoolLogo.name}</span>
                      <span className="text-xs text-zinc-500 mt-1">Click to replace</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                      <span className="text-sm text-zinc-300 font-medium tracking-tight">Click to upload image</span>
                    </>
                  )}
                  <input type="file" required={!schoolLogo} accept="image/*" className="hidden" id="school-logo" onChange={(e) => setSchoolLogo(e.target.files?.[0] || null)} />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">PNG or JPG, max 2MB.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2">Media Unit Logo</label>
                <div 
                  className={`border-dashed border rounded-[1rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden ${mediaLogo ? 'border-primary/50 bg-primary/5 py-4' : 'border-zinc-700 py-6'}`}
                  onClick={() => document.getElementById('media-logo')?.click()}
                >
                  {mediaLogo ? (
                    <div className="flex flex-col items-center text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                        <UploadCloud className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white truncate max-w-[200px]">{mediaLogo.name}</span>
                      <span className="text-xs text-zinc-500 mt-1">Click to replace</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                      <span className="text-sm text-zinc-300 font-medium tracking-tight">Click to upload image</span>
                    </>
                  )}
                  <input type="file" required={!mediaLogo} accept="image/*" className="hidden" id="media-logo" onChange={(e) => setMediaLogo(e.target.files?.[0] || null)} />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">PNG or JPG, max 2MB.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-white text-black font-semibold rounded-lg px-8 py-4 hover:bg-zinc-200 transition-colors text-sm normal-case disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving Profile...' : 'Complete Profile & Continue'}
            </button>
          </div>
        </form>
        </div>

      </div>
      
    </Bg>
  );
}
