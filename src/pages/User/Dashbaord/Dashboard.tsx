import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import DashboardSidebar from "../subcomponents/Menu";
import DashboardHeader from "../subcomponents/Header";
import DashboardFooter from "../subcomponents/Footer";
import ContestantsTable from "./TableLayout";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Terminating session...");
    navigate("/login");
  };

  return (
    // 1. h-screen and overflow-hidden prevent the entire page from scrolling globally
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">

      {/* ── Fixed Desktop Sidebar ── */}
      <div className="hidden md:flex h-full flex-shrink-0 z-20 border-r border-gray-100">
        <DashboardSidebar
          active={activeNav}
          onNavigate={setActiveNav}
          onLogout={handleLogout}
        />
      </div>

      {/* ── Mobile Sidebar Sheet Drawer ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[210px]">
          <DashboardSidebar
            active={activeNav}
            onNavigate={(label) => { setActiveNav(label); setMobileOpen(false); }}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      {/* ── Main content column (Flex container) ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative">

        {/* ── Fixed Mobile Top Bar (Hamburger + Logo) ── */}
        <div className="flex md:hidden items-center px-4 py-3 bg-white border-b border-gray-100 shrink-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex justify-center">
            <img
              src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/sambhasha-logo.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3NhbWJoYXNoYS1sb2dvLndlYnAiLCJpYXQiOjE3NzQ5NTYyMzgsImV4cCI6MTgwNjQ5MjIzOH0.gcyvRLaqUXqqk1I-8R8URHoWBnzF7uCVbhut2jMX7dM"
              alt="Sambhasha"
              className="h-10 object-contain"
            />
          </div>
          <div className="w-7 flex-shrink-0" />
        </div>

        {/* ── Fixed Header & Action Pills ── */}
        {/* shrink-0 ensures this section never squishes or scrolls */}
        <div className="shrink-0 px-4 md:px-8 pt-4 md:pt-6 bg-gray-50">
          <DashboardHeader
            eventTitle="SAMBHASHA XXVI – THE MEDIA DAY"
            schoolName="Nalanda College Colombo"
            schoolId="SAM255"
          />

          <div className="flex flex-wrap gap-2 mb-4 justify-center">
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
        </div>

        {/* ── Inner Scrollable Wrapper strictly for the Table ── */}
        <main className="flex-1 overflow-hidden px-4 md:px-8 pb-4 flex flex-col min-h-0">
          <ContestantsTable
            currentPage={currentPage}
            totalPages={4}
            totalRecords={20}
            onPageChange={setCurrentPage}
          />
        </main>

        {/* ── Fixed Footer ── */}
        <div className="shrink-0 z-10">
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}