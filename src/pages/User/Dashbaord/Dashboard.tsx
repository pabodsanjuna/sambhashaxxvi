// Dashboard.tsx
// Root dashboard page — owns the 4 action pill buttons and the mobile top bar.
//
// Layout:
//   Desktop  → fixed sidebar left | scrollable content right
//   Mobile   → hamburger (left) + Sambhasha logo (center) top bar
//              sidebar slides in as a Sheet drawer from the left
//
// shadcn/ui: Sheet, SheetContent, SheetTrigger, Button
// lucide-react: Menu

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import ContestantsTable from "./ContestantsTable";
import DashboardFooter from "./DashboardFooter";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Desktop Sidebar (always visible ≥ md) ── */}
      <div className="hidden md:flex flex-shrink-0">
        <DashboardSidebar
          active={activeNav}
          onNavigate={setActiveNav}
          onLogout={() => console.log("Logout")}
        />
      </div>

      {/* ── Mobile Sidebar Sheet Drawer ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[210px]">
          <DashboardSidebar
            active={activeNav}
            onNavigate={(label) => { setActiveNav(label); setMobileOpen(false); }}
            onLogout={() => console.log("Logout")}
          />
        </SheetContent>
      </Sheet>

      {/* ── Main content column ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* ── Mobile top bar: hamburger LEFT | logo CENTER ── */}
        <div className="flex md:hidden items-center px-4 pt-5 pb-3 gap-3">
          {/* Hamburger — opens sidebar drawer */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sambhasha logo — centered */}
          <div className="flex-1 flex justify-center">
            {/* REPLACE_SAMBHASHA_LOGO */}
            <img
              src="https://placehold.co/120x36/1a1a1a/1a1a1a?text=SAMBHASHA"
              alt="Sambhasha"
              className="h-8 object-contain"
            />
          </div>

          {/* Right spacer — keeps logo visually centered */}
          <div className="w-7 flex-shrink-0" />
        </div>

        {/* ── Scrollable content area ── */}
        <main className="flex-1 overflow-auto px-4 md:px-8 pt-2 md:pt-8 pb-4">

          {/* Dashboard header: title + school breadcrumb only */}
          <DashboardHeader
            eventTitle="SAMBHASHA XXVI – THE MEDIA DAY"
            schoolName="Nalanda College Colombo"
            schoolId="SAM255"
          />

          {/* ── 4 Action pill buttons — owned by Dashboard, not DashboardHeader ── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {/* Row 1 on mobile / left side on desktop */}
            <Button
              onClick={() => console.log("Add Contestants")}
              className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all"
            >
              Add Contestants
            </Button>
            <Button
              onClick={() => console.log("View Category Location Map")}
              className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all"
            >
              View Category Location Map
            </Button>

            {/* Right-aligned pair on desktop */}
            <div className="flex gap-2 md:ml-auto">
              <Button
                onClick={() => console.log("Bulk Registration")}
                className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all"
              >
                Bulk Contestants Registration
              </Button>
              <Button
                onClick={() => console.log("Download Excel")}
                className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold tracking-wide h-9 px-5 active:scale-95 transition-all"
              >
                Download Excel Format
              </Button>
            </div>
          </div>

          {/* Contestants table with search + pagination */}
          <ContestantsTable
            currentPage={currentPage}
            totalPages={4}
            totalRecords={20}
            onPageChange={setCurrentPage}
            onSearch={(q) => console.log("Search:", q)}
            onFilter={() => console.log("Filter")}
          />
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}