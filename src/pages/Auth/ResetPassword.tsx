// src/pages/Auth/ResetPassword.tsx
import { useNavigate } from "react-router-dom";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const navigate = useNavigate(); // <-- Initialize Navigation

  return (
    <div className="w-full flex flex-col items-center text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
        Reset Password
      </h1>
      <p className="text-sm text-gray-500 mb-6">Security Policy Restriction</p>

      <div className="flex items-center justify-center gap-2 mb-5">
        <Ban className="w-7 h-7 text-gray-800 flex-shrink-0" strokeWidth={1.5} />
        <span className="text-base font-medium text-gray-800">Action Not Permitted</span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        For security reasons, you cannot reset your
        <br />password automatically.
      </p>

      <p className="text-sm text-gray-600 leading-relaxed mb-7">
        If you need further help, please{" "}
        <a href="mailto:admin@nccu.edu" className="underline text-gray-700 hover:text-gray-900 transition-colors">
          contact
        </a>
        <br />
        the system administrator directly.
      </p>

      <Button
        onClick={() => navigate('/login')} // <-- Route back to Login
        className="rounded-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold tracking-wide px-10 h-11 active:scale-95 transition-all duration-150"
      >
        Back to Login
      </Button>
    </div>
  );
}