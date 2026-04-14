// DashboardHeader.tsx
// Only contains: crimson event title + school name / school ID breadcrumb.
// The 4 action buttons live in Dashboard.tsx, NOT here.
// shadcn/ui: none required

interface DashboardHeaderProps {
  eventTitle?: string;
  schoolName?: string;
  schoolId?: string;
}

export default function DashboardHeader({
  eventTitle = "SAMBHASHA XXVI – THE MEDIA COMPETITION",
  schoolName = "Nalanda College Colombo",
  schoolId = "SAM255",
}: DashboardHeaderProps) {
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
          <span className="text-[#8b0000]">{schoolName}</span>
        </span>
        <span>
          <span className="text-gray-400">&gt;</span>{" "}
          <span className="font-medium">School ID –</span>{" "}
          <span className="text-[#8b0000]">{schoolId}</span>
        </span>
      </div>
    </div>
  );
}