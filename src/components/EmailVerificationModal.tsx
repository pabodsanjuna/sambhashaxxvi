import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface EmailVerificationModalProps {
  open: boolean;
  email: string;
  schoolId: string;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export default function EmailVerificationModal({
  open,
  email,
  schoolId,
  onOpenChange,
  onContinue,
}: EmailVerificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl">Registration Successful!</DialogTitle>
          <DialogDescription className="text-center mt-4 space-y-3">
            <p className="font-semibold text-gray-900">A verification email has been sent to:</p>
            <p className="text-sm bg-blue-50 p-3 rounded text-gray-700">{email}</p>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold text-gray-900 mb-2">Your School ID:</p>
              <p className="text-2xl font-bold text-blue-600 tracking-widest">{schoolId}</p>
              <p className="text-xs text-gray-500 mt-2">Please save your School ID for future reference</p>
            </div>

            <p className="text-sm text-gray-600 mt-6">
              Please check your email and click the verification link to activate your account.
              <br />
              <span className="text-xs text-gray-500">You may not be able to login until you verify your email.</span>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onContinue}
            className="flex-1 rounded-xl bg-[#262626] hover:bg-[#373737] text-white font-semibold"
          >
            Continue to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
