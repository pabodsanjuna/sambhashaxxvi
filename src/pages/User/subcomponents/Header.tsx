import { useAuth } from "@/lib/AuthContext";

// DashboardHeader.tsx
// Only contains: crimson event title + school name / school ID breadcrumb.
// The 4 action buttons live in Dashboard.tsx, NOT here.
// Real-time data from Supabase via AuthContext

interface DashboardHeaderProps {
  eventTitle?: string;
}

export default function DashboardHeader({
  eventTitle = "SAMBHASHA XXVI – THE MEDIA COMPETITION",
}: DashboardHeaderProps) {
  const { user } = useAuth();
  
  const schoolName = user?.school_name || "School Name";
  const City = user?.city || "City";
  const schoolId = user?.school_id || "SAM---";

  return (
    <div className="w-full pb-4">
      {/* Crimson serif title */}
      <h1
        className="text-xl md:text-3xl font-light tracking-wide uppercase leading-tight bg-[linear-gradient(90deg,#450000,#AB0000)] bg-clip-text text-transparent">
        {eventTitle}
      </h1>

      {/* Breadcrumb: School Name + School ID */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1.5 text-xs md:text-sm text-gray-600">
        <span>
          <span className="text-gray-400">&gt;</span>{" "}
          <span className="font-medium">School Name </span>{" "}
          <span className="text-[#8b0000]">{schoolName} , {City}</span>
        </span>
        <span>
          <span className="text-gray-400">&gt;</span>{" "}
          <span className="font-medium">School ID –</span>{" "}
          <span className="text-[#8b0000]">{schoolId}</span>
        </span>
      </div>
    </div>
  )};