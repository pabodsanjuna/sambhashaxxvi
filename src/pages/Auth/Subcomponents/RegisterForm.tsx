import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import FormInput from "./FormInput";
import { signUp, uploadLogoFile, updateUserLogos, getSchoolIdByUserId } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { step1Schema, step2Schema, step3Schema } from "@/lib/schemas";
import { ZodError } from "zod";
import EmailVerificationModal from "@/components/EmailVerificationModal";

// ─── Step 1: School Details ───────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  error,
}: {
  data: Record<string, string>;
  onChange: (k: string, v: string) => void;
  error?: string;
}) {
  return (
    <>
      <p className="text-sm text-gray-500 mb-4 text-center">Enter Your School Details</p>
      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="w-full flex flex-col gap-3 mb-3">
        <FormInput label="School Name" value={data.schoolName} onChange={(e) => onChange("schoolName", e.target.value)} />
        <FormInput label="City" value={data.city} onChange={(e) => onChange("city", e.target.value)} />
        <FormInput label="Official Phone Number" type="tel" value={data.phone} onChange={(e) => onChange("phone", e.target.value)} />
        <FormInput label="Address" value={data.address} onChange={(e) => onChange("address", e.target.value)} />
      </div>
    </>
  );
}

// ─── Step 2: Professional Details ────────────────────────────────────────────

function Step2({
  data,
  onChange,
  error,
}: {
  data: Record<string, string>;
  onChange: (k: string, v: string) => void;
  error?: string;
}) {
  return (
    <>
      <p className="text-sm text-gray-500 mb-4 text-center">Enter Professional Details</p>
      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="w-full flex flex-col gap-3 mb-3">
        <FormInput label="Name of Master In Charge" value={data.micName} onChange={(e) => onChange("micName", e.target.value)} />
        <FormInput label="MIC Contact" type="tel" value={data.micContact} onChange={(e) => onChange("micContact", e.target.value)} />
        <FormInput label="Name of Co-Ordinator Name" value={data.coordinatorName} onChange={(e) => onChange("coordinatorName", e.target.value)} />
        <FormInput label="Co-Ordinator Contact ( Whatsapp )" type="tel" value={data.coordinatorContact} onChange={(e) => onChange("coordinatorContact", e.target.value)} />
      </div>
    </>
  );
}

// ─── Step 3: Security ─────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  error,
}: {
  data: Record<string, string>;
  onChange: (k: string, v: string) => void;
  error?: string;
}) {
  return (
    <>
      <p className="text-sm text-gray-500 mb-4 text-center">Security Information</p>
      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">Password must be at least 8 characters</p>
          <p className="text-sm text-red-700">Password must contain at least one uppercase | lowercase letter & one number</p>
        </div>

      <div className="w-full flex flex-col gap-3 mb-3">
        <FormInput label="Email Address" type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)} />
        <FormInput label="Password" type="password" value={data.password} onChange={(e) => onChange("password", e.target.value)} />
        <FormInput label="Confirm Password" type="password" value={data.confirmPassword} onChange={(e) => onChange("confirmPassword", e.target.value)} />
      </div>
    </>
  );
}

// ─── Upload Field ─────────────────────────────────────────────────────────────

function UploadField({
  label,
  file,
  onSelect,
}: {
  label: string;
  file: File | null;
  onSelect: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => ref.current?.click()}
      className="flex items-center gap-2 flex-1 rounded-full border-gray-200 text-gray-400 bg-white hover:border-red-900/40 hover:bg-white h-11 px-4 font-normal justify-start"
    >
      <Upload className="w-4 h-4 flex-shrink-0 text-gray-400" />
      <span className="truncate text-sm">{file ? file.name : label}</span>
      <input
        ref={ref}
        type="file"
        accept=".png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
    </Button>
  );
}

// ─── Step 4: Logo Upload ──────────────────────────────────────────────────────

function Step4({
  schoolLogo,
  mediaLogo,
  onSchoolLogo,
  onMediaLogo,
  error,
}: {
  schoolLogo: File | null;
  mediaLogo: File | null;
  onSchoolLogo: (f: File) => void;
  onMediaLogo: (f: File) => void;
  error?: string;
}) {
  return (
    <>
      <p className="text-sm text-gray-500 mb-3 text-center">Upload your school and media unit logos</p>
      <p className="text-xs text-gray-400 mb-4 text-center">Max : 1MB , PNG File only , 500px x 500px (recomended)</p>

      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="w-full flex gap-2 mb-6 justify-center">
        <UploadField label="School Logo" file={schoolLogo} onSelect={onSchoolLogo} />
        <UploadField label="Media Unit Logo" file={mediaLogo} onSelect={onMediaLogo} />
      </div>

      <div className="w-full text-left mb-3 px-1 space-y-1">
        <p className="text-sm font-semibold text-gray-800">Important Notice:</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          You will not be able to change your password after registration.
          <br/>
          <span className="font-bold">Please ensure you remember your credentials.</span>
          
        </p>
      </div>
    </>
  );
}

// ─── Main RegisterForm ────────────────────────────────────────────────────────

export default function RegisterForm() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const TOTAL = 4;

  const [schoolDetails, setSchoolDetails] = useState({ schoolName: "", city: "", phone: "", address: "" });
  const [professionalDetails, setProfessionalDetails] = useState({ micName: "", micContact: "", coordinatorName: "", coordinatorContact: "" });
  const [security, setSecurity] = useState({ email: "", password: "", confirmPassword: "" });
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null);
  const [mediaLogo, setMediaLogo] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredSchoolId, setRegisteredSchoolId] = useState("");

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const change =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (key: string, value: string) =>
      setter((prev: any) => ({ ...prev, [key]: value }));

  const isLast = step === TOTAL;

  const handleNext = async () => {
    setError("");

    try {
      if (step === 1) {
        step1Schema.parse(schoolDetails);
        setStep((s) => s + 1);
      } else if (step === 2) {
        step2Schema.parse(professionalDetails);
        setStep((s) => s + 1);
      } else if (step === 3) {
        step3Schema.parse(security);
        setStep((s) => s + 1);
      } else if (step === 4) {
        // Validate at least one logo is provided
        if (!schoolLogo && !mediaLogo) {
          setError('Please upload at least one logo (School Logo or Media Unit Logo)');
          return;
        }
        // Proceed to registration (handleRegister will be called separately)
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // Validate all data one more time
      step1Schema.parse(schoolDetails);
      step2Schema.parse(professionalDetails);
      step3Schema.parse(security);

      // Prepare registration data
      const registrationData = {
        email: security.email,
        password: security.password,
        schoolName: schoolDetails.schoolName,
        city: schoolDetails.city,
        phone: schoolDetails.phone,
        address: schoolDetails.address,
        micName: professionalDetails.micName,
        micContact: professionalDetails.micContact,
        coordinatorName: professionalDetails.coordinatorName,
        coordinatorContact: professionalDetails.coordinatorContact,
      };

      // Sign up with Supabase
      // User profile is automatically created by PostgreSQL trigger
      const signUpResult = await signUp(registrationData);
      const userId = signUpResult.user.id;
      console.log('[handleRegister] Auth user created:', userId);

      // Wait for trigger to create profile
      console.log('[handleRegister] Waiting for profile creation...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Fetch school_id via RPC (bypasses RLS restrictions)
      console.log('[handleRegister] Fetching school_id via RPC...');
      const schoolId = await getSchoolIdByUserId(userId);
      console.log('[handleRegister] ✓ School ID retrieved:', schoolId);

      // Upload logos if provided
      let schoolLogoPath: string | undefined;
      let mediaLogoPath: string | undefined;

      if (schoolLogo) {
        console.log('[handleRegister] Uploading school logo...');
        schoolLogoPath = await uploadLogoFile(
          schoolLogo,
          'school-logos',
          userId,
          schoolDetails.schoolName
        );
        console.log('[handleRegister] ✓ School logo uploaded:', schoolLogoPath);
      }

      if (mediaLogo) {
        console.log('[handleRegister] Uploading media logo...');
        mediaLogoPath = await uploadLogoFile(
          mediaLogo,
          'media-logos',
          userId,
          schoolDetails.schoolName
        );
        console.log('[handleRegister] ✓ Media logo uploaded:', mediaLogoPath);
      }

      // Update user profile with logo paths
      if (schoolLogoPath || mediaLogoPath) {
        console.log('[handleRegister] Updating user profile with logo paths...');
        await updateUserLogos(userId, schoolLogoPath, mediaLogoPath, schoolDetails.schoolName);
      }

      // Show verification modal instead of navigating
      setRegisteredEmail(security.email);
      setRegisteredSchoolId(schoolId);
      setShowVerifyModal(true);
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight text-center">
        Create an Account
      </h1>

      {step === 1 && <Step1 data={schoolDetails} onChange={change(setSchoolDetails)} error={error} />}
      {step === 2 && <Step2 data={professionalDetails} onChange={change(setProfessionalDetails)} error={error} />}
      {step === 3 && <Step3 data={security} onChange={change(setSecurity)} error={error} />}
      {step === 4 && <Step4 schoolLogo={schoolLogo} mediaLogo={mediaLogo} onSchoolLogo={setSchoolLogo} onMediaLogo={setMediaLogo} error={error} />}

      <div className="flex items-center justify-center gap-6 w-full mt-4">
        <Button
          onClick={isLast ? handleRegister : handleNext}
          disabled={loading}
          className="rounded-xl bg-[#262626] hover:bg-[#373737] disabled:opacity-50 cursor-pointer text-white text-sm font-semibold tracking-wide px-14 h-11 active:scale-95 transition-all duration-150"
        >
          {loading ? "Registering..." : isLast ? "Register" : "Next"}
        </Button>
        <span className="text-sm text-gray-400">Steps : {step}/{TOTAL}</span>
      </div>

      <Button
        variant="link"
        onClick={() => navigate('/login')}
        disabled={loading}
        className="mt-3 text-xs text-[#8D7471] cursor-pointer hover:text-gray-600 h-auto p-0 disabled:opacity-50"
      >
        Already have an account?{" "}
        <span className="text-gray-500 font-medium ml-1">Sign In</span>
      </Button>

      <EmailVerificationModal
        open={showVerifyModal}
        email={registeredEmail}
        schoolId={registeredSchoolId}
        onOpenChange={setShowVerifyModal}
        onContinue={() => navigate('/login')}
      />
    </div>
  );
}