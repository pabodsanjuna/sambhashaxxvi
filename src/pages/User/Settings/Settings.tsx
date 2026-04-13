import { useEffect, useState } from "react";
import {
  Shield,
  Phone,
  MapPin,
  User,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
      <span className="text-sm text-gray-500">
        <span className="text-gray-700 font-medium">{label} : </span>
        {value}
      </span>
    </div>
  );
}
 
// ─── Settings Content ─────────────────────────────────────────────────────────

function SettingsContent() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Get user ID from auth context
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUserId) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUserId)
          .single();

        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
        <p className="text-gray-500">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
          Settings – SAMBHASHA XXVI REGISTRATION PORTAL
        </p>
        <Separator className="mt-3" />
      </div>

      {/* School card header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarImage 
            src={profileData.school_logo_path}
            alt={profileData.school_name}
          />
        </Avatar>
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={profileData.media_logo_path}
            alt="Media Logo"
          />
        </Avatar>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
            {profileData.school_name},{profileData.city}
          </h2>
          <Badge
            variant="outline"
            className="mt-1 text-xs text-red-600 border-red-200 bg-red-50 font-semibold tracking-wide"
          >
            SCHOOL ID – {profileData.school_id}
          </Badge>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: School Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          {/* School Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              School Information
            </h3>
            <div className="space-y-0.5 pl-3">
              <InfoRow
                icon={User}
                label="School Name"
                value={profileData.school_name || "N/A"}
              />
              <InfoRow
                icon={MapPin}
                label="City"
                value={profileData.city || "N/A"}
              />
              <InfoRow
                icon={Phone}
                label="Official Phone Number"
                value={profileData.phone || "N/A"}
              />
              <InfoRow icon={MapPin} label="Address" value={profileData.address || "N/A"} />
            </div>
          </div>

          <Separator />

          {/* Professional Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              Professional Details
            </h3>
            <div className="space-y-0.5 pl-3">
              <InfoRow
                icon={User}
                label="Name of Master In Charge"
                value={profileData.mic_name || "N/A"}
              />
              <InfoRow
                icon={Phone}
                label="MIC Contact"
                value={profileData.mic_contact || "N/A"}
              />
              <InfoRow
                icon={User}
                label="Name of Co-Ordinator"
                value={profileData.coordinator_name || "N/A"}
              />
              <InfoRow
                icon={MessageCircle}
                label="Co-Ordinator Contact (Whatsapp)"
                value={profileData.coordinator_contact || "N/A"}
              />
            </div>
          </div>
        </div>

        {/* Right: Account Info */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-blue-700 tracking-wider uppercase">
              Account Information
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-white/60 border border-blue-100 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <p className="text-sm font-semibold text-gray-800">{profileData.email}</p>
            </div>

            <div className="bg-white/60 border border-blue-100 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Member Since</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(profileData.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <Separator className="bg-blue-200" />

          <p className="text-sm text-blue-700">
            For security reasons, you cannot directly modify your school's registration details.
            <span className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity ml-1">
              Contact us from below numbers
            </span>
          </p>
          <p className="font-semibold hover:opacity-80 transition-opacity ml-1 text-blue-700 cursor-pointer">
              Kisara Vonal : +94 77 123 4567
          </p>
          <p className="font-semibold hover:opacity-80 transition-opacity ml-1 text-blue-700 cursor-pointer">
              Pabod Sanjuna : +94 77 123 4567
          </p>
        </div>
      </div>
    </div>
  );
}
export default function SambhashaSettings() {
  return (
    <>
        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <SettingsContent />
          </main>
        </div>
    </>
  );
}