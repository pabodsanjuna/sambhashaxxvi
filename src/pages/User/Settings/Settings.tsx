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

const schoolInfo = {
  name: "Nalanda College , Colombo 10",
  id: "SAM255",
  logo: "/nalanda-logo.png",
  phone: "+94 11 587 2369",
  address: "Siri Dhamma Mawatha, Colombo 01000",
  mic: {
    name: "Mrs. Gayani Mirihagalla",
    contact: "+94 12 345 6978",
  },
  coordinator: {
    name: "Kisara Vonal Hettige",
    contact: "+94 12 345 6978",
  },
  admins: [
    { name: "Kisara Vonal", phone: "+94 12 345 6987" },
    { name: "Pabod Sanjuna", phone: "+94 12 345 6987" },
  ],
};
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
        <Avatar className="w-16 h-16 ring-2 ring-red-100">
          <AvatarImage src="/nalanda-logo.png" alt="Nalanda College" />
          <AvatarFallback className="bg-red-50 text-red-700 text-lg font-bold">
            NC
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
            {schoolInfo.name}
          </h2>
          <Badge
            variant="outline"
            className="mt-1 text-xs text-red-600 border-red-200 bg-red-50 font-semibold tracking-wide"
          >
            SCHOOL ID – {schoolInfo.id}
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
                value="Nalanda College  Colombo 10"
              />
              <InfoRow
                icon={Phone}
                label="Official Phone Number"
                value={schoolInfo.phone}
              />
              <InfoRow icon={MapPin} label="Address" value={schoolInfo.address} />
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
                value={schoolInfo.mic.name}
              />
              <InfoRow
                icon={Phone}
                label="MIC Contact"
                value={schoolInfo.mic.contact}
              />
              <InfoRow
                icon={User}
                label="Name of Co-Ordinator"
                value={schoolInfo.coordinator.name}
              />
              <InfoRow
                icon={MessageCircle}
                label="Co-Ordinator Contact (Whatsapp)"
                value={schoolInfo.coordinator.contact}
              />
            </div>
          </div>
        </div>

        {/* Right: Security Notice */}
        <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-red-700 tracking-wider uppercase">
              Security Notice
            </h3>
          </div>

          <p className="text-sm text-red-600 leading-relaxed">
            For security reasons, you cannot directly modify your school's
            registration details or profile image.
          </p>

          <div>
            <p className="text-sm text-red-600 mb-3">
              To Request Change Details or Recover Password{" "}
              <a
                href="#"
                className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Contact System Admins
              </a>
            </p>

            <div className="space-y-2.5">
              {schoolInfo.admins.map((admin) => (
                <div
                  key={admin.name}
                  className="flex items-center justify-between bg-white/60 border border-red-100 rounded-lg px-4 py-2.5"
                >
                  <span className="text-sm font-semibold text-red-700">
                    {admin.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-red-700">
                    <Phone className="w-3 h-3" />
                    {admin.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

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