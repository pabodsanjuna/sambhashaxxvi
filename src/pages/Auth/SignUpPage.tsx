import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white">
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <SignUp 
            path="/sign-up" 
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}