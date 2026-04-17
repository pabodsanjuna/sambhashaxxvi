import { SignIn } from "@clerk/react";
import Footer from "./Footer";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-metallic-silver">
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <SignIn 
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}