import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white">
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <SignIn 
            path="/sign-in" 
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}