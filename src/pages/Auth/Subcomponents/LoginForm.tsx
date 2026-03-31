import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";

interface LoginFormProps {
  onGoRegister: () => void;
}

export default function LoginForm({ onGoRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    console.log("Sign In →", { email, password });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight text-center">
        Welcome Back
      </h1>
      <p className="text-sm text-gray-500 mb-7 text-center">
        Sign in with email and password
      </p>

      {/* Fields */}
      <div className="w-full flex flex-col gap-3 mb-5">
        <FormInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Sign In button */}
      <Button
        onClick={handleSignIn}
        className="rounded-xl bg-[#262626] hover:bg-[#262626] cursor-pointer text-white text-sm font-semibold tracking-wide px-14 h-11 mb-6 active:scale-95 transition-all duration-150"
      >
        Sign In
      </Button>

      {/* Footer links */}
      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-0 md:justify-between w-full">
        <Button
          variant="link"
          className="text-xs text-[#8D7471] cursor-pointer hover:text-gray-600 h-auto p-0"
        >
          Forget Password ?
        </Button>
        <Button
          variant="link"
          onClick={onGoRegister}
          className="text-xs text-[#8D7471] cursor-pointer hover:text-gray-600 h-auto p-0"
        >
          Don't have an account ?{" "}
          <span className="text-gray-500 font-medium ml-1">Register Now</span>
        </Button>
      </div>
    </div>
  );
}
