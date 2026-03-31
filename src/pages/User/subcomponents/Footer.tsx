// DashboardFooter.tsx
// Simple centered footer used in the dashboard layout.
// shadcn/ui: Button (link variant)

import { Button } from "@/components/ui/button";

export default function DashboardFooter() {
  return (
    <footer className="w-full py-5 border-t border-gray-100 bg-white mt-auto">
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-xs text-gray-500">
          © NCCU Studios 2026 . All Right Reserved
        </p>
        <div className="flex items-center gap-4">
          <Button
            variant="link"
            size="sm"
            className="text-xs text-gray-400 hover:text-gray-600 h-auto p-0"
          >
            Privacy Policy
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-gray-400 hover:text-gray-600 h-auto p-0"
          >
            Terms &amp; Conditions
          </Button>
        </div>
      </div>
    </footer>
  );
}