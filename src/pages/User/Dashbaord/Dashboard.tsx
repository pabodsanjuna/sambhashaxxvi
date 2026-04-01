// src/pages/User/Dashbaord/Dashboard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContestantsTable from "./TableLayout";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Action Pills */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center shrink-0">
        <Button className="rounded-full bg-[#262626] hover:bg-[#373737] text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all">
          Add Contestants
        </Button>
        <Button className="rounded-full bg-[#262626] hover:bg-[#373737] text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all">
          Category locations
        </Button>

        <div className="flex gap-2 md:ml-auto">
          <Button className="rounded-full bg-[#262626] hover:bg-[#373737] text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all">
            Bulk Upload
          </Button>
          <Button className="rounded-full bg-[#262626] hover:bg-[#373737] text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all">
            Download Excel Format
          </Button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 min-h-0">
        <ContestantsTable
          currentPage={currentPage}
          totalPages={4}
          totalRecords={20}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}