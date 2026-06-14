import { SignUp } from '@clerk/clerk-react';

export function SignUpForm() {
  return (
    <div className="flex flex-col justify-center items-center w-full p-8 rounded-4xl border border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]">
    <img 
        src="/nccu_logo.webp" 
        alt="Nalanda College Communication Unit" 
        className="h-20 w-auto mb-4 mt-2 opacity-90 object-contain" 
      />
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboarding" appearance={{
        elements: {
          rootBox: "w-full",
          cardBox: "w-full shadow-none",
          card: "bg-transparent w-full shadow-none m-0 border-0 p-0",
          headerTitle: "text-2xl font-semibold tracking-tight text-white",
          headerSubtitle: "text-sm text-zinc-400 mt-2",
          socialButtonsBlockButton: "inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
          socialButtonsBlockButtonText: "text-white font-medium",
          dividerLine: "bg-zinc-800",
          dividerText: "text-xs text-zinc-500",
          formFieldLabel: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200 mb-3",
          formFieldInput: "flex h-12 w-full rounded-full border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          formButtonPrimary: "inline-flex h-12 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 w-full mt-2 normal-case",
          footer: "bg-transparent",
          footerAction: "bg-transparent",
          footerActionText: "text-sm text-zinc-400 bg-transparent",
          footerActionLink: "text-sm text-white font-medium hover:underline",
          identityPreviewText: "text-white",
          identityPreviewEditButtonIcon: "text-white hover:text-zinc-300",
          formFieldAction: "text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        },
        variables: {
          colorPrimary: "#ffffff",
          colorTextOnPrimaryBackground: "#000000",
          colorText: "#ffffff",
          colorBackground: "transparent",
          colorInputText: "white",
          colorInputBackground: "rgba(255, 255, 255, 0.05)",
        }
      }} />
    </div>
  );
}
