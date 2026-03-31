import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="relative z-10 flex-shrink-0 bg-gray-100/80 border-t border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex gap-2 order-2 md:order-1">
          <Button variant="link" size="sm" className="text-xs text-gray-500 h-auto p-0 hover:text-gray-700">
            Privacy Policy
          </Button>
          <Button variant="link" size="sm" className="text-xs text-gray-500 h-auto p-0 hover:text-gray-700">
            Terms &amp; Conditions
          </Button>
        </div>
        <p className="order-1 md:order-2 text-center md:text-right text-xs text-gray-500">
          © NCCU Studios 2026 . All Right Reserved
        </p>
      </div>
    </footer>
  );
}
