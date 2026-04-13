import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/lib/AuthContext";
import { loginSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form data
      loginSchema.parse({ email, password });

      // Sign in with Supabase
      const result = await signIn(email, password);

      // Navigate to dashboard
      navigate(`/dashboard`);
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight text-center">
        Welcome Back
      </h1>
      <p className="text-sm text-gray-500 mb-7 text-center">
        Sign in with email and password
      </p>

      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSignIn} className="w-full flex flex-col gap-3 mb-5">
        <FormInput 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <FormInput 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#262626] hover:bg-[#373737] disabled:opacity-50 cursor-pointer text-white text-sm font-semibold tracking-wide px-14 h-11 mb-6 active:scale-95 transition-all duration-150"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-0 md:justify-between w-full">
        <Button
          variant="link"
          onClick={() => navigate('/reset-password')}
          disabled={loading}
          className="text-xs text-[#8D7471] cursor-pointer hover:text-gray-600 h-auto p-0 disabled:opacity-50"
        >
          Forget Password ?
        </Button>
        <Button
          variant="link"
          onClick={() => navigate('/register')}
          disabled={loading}
          className="text-xs text-[#8D7471] cursor-pointer hover:text-gray-600 h-auto p-0 disabled:opacity-50"
        >
          Don't have an account ?{" "}
          <span className="text-gray-500 font-medium ml-1">Register Now</span>
        </Button>
      </div>
    </div>
  );
}