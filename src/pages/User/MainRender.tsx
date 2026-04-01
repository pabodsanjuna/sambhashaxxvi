import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { DashboardSidebar , DashboardHeader , DashboardFooter} from "./subcomponents/UserComponents";

export default function Mainrender() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically determine the active nav item based on the exact root path
  const getActiveNav = () => {
    if (location.pathname === "/rules") return "Rules & Regulation";
    if (location.pathname === "/categories") return "Categories";
    if (location.pathname === "/submissions") return "Submissions";
    return "Dashboard"; // Default for /dashboard
  };

  // Map sidebar labels to their respective root-level routes
  const handleNavigate = (label: string) => {
    setMobileOpen(false); // Close mobile sheet on navigation
    if (label === "Dashboard") navigate("/dashboard");
    else if (label === "Rules & Regulation") navigate("/rules");
    else if (label === "Categories") navigate("/categories");
    else if (label === "Submissions") navigate("/submissions");
  };

  const handleLogout = () => {
    console.log("Terminating session...");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* ── Fixed Desktop Sidebar ── */}
      <div className="hidden md:flex h-full flex-shrink-0 z-20 border-r border-gray-100">
        <DashboardSidebar
          active={getActiveNav()}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {/* ── Mobile Sidebar Sheet Drawer ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[210px]">
          <DashboardSidebar
            active={getActiveNav()}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>

      {/* ── Main content column (Flex container) ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* ── Fixed Mobile Top Bar ── */}
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

        {/* ── Fixed Header ── */}
        <div className="shrink-0 px-4 md:px-8 pt-4 md:pt-6 bg-gray-50">
          <DashboardHeader
            eventTitle="SAMBHASHA XXVI – THE MEDIA DAY"
            schoolName="Nalanda College Colombo"
            schoolId="SAM255"
          />
        </div>

        {/* ── Dynamic Route Content (Outlet) ── */}
        {/* The active route component injects here */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 pt-4 flex flex-col min-h-0">
          <Outlet />
        </main>

        {/* ── Fixed Footer ── */}
        <div className="shrink-0 z-10">
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}