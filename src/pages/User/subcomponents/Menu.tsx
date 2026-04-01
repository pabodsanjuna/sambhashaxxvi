// DashboardSidebar.tsx
// Left sidebar with nav items: Dashboard, Categories, Rules & Regulation, Submissions
// Bottom: Settings, Logout
// shadcn/ui: Button
// lucide-react: icons
// Mobile: hidden (handled by Dashboard.tsx with sheet/drawer)

import { useState } from "react";
import {
  LayoutDashboard,
  Tag,
  ScrollText,
  Send,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard",          icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Categories",         icon: <Tag className="w-4 h-4" /> },
  { label: "Rules & Regulation", icon: <ScrollText className="w-4 h-4" /> },
  { label: "Submissions",        icon: <Send className="w-4 h-4" /> },
];

interface DashboardSidebarProps {
  active?: string;
  onNavigate?: (label: string) => void;
  onLogout?: () => void;
}

export default function DashboardSidebar({
  active = "Dashboard",
  onNavigate,
  onLogout,
}: DashboardSidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <aside className="flex flex-col w-[210px] min-h-screen bg-white border-r border-gray-100 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-5 pb-2 ">
        {/* REPLACE_SAMBHASHA_LOGO */}
        <img
          src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/sambhasha-logo.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3NhbWJoYXNoYS1sb2dvLndlYnAiLCJpYXQiOjE3NzQ5NTYyMzgsImV4cCI6MTgwNjQ5MjIzOH0.gcyvRLaqUXqqk1I-8R8URHoWBnzF7uCVbhut2jMX7dM"
          alt="Sambhasha"
          className="h-15 w-50 object-contain"
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs transition-all duration-150 group",
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn("transition-colors", isActive ? "text-gray-800" : "text-gray-400 group-hover:text-gray-600")}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isActive ? "text-gray-500" : "text-gray-300 group-hover:text-gray-400"
                )}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="px-3 pb-6 flex flex-col gap-1">
        <button
          onClick={() => onNavigate?.("Settings")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs text-gray-500 hover:bg-red-50 hover:text-red-700 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}