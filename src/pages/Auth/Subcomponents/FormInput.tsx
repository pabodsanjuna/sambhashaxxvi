import { useState, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FormInput({ label, className, ...rest }: FormInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Input
      {...rest}
      placeholder={label}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "rounded-xl border bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 h-auto transition-all duration-200 outline-none focus-visible:ring-0",
        className
      )}
      style={{
        borderColor: focused ? "#BF8989" : "#594040",
        boxShadow: focused ? "0 0 0 2px rgba(139,0,0,0.10)" : "none",
      }}
    />
  );
}
