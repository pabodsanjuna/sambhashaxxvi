import { useState, SelectHTMLAttributes } from "react";
import {FormInput} from "../../Auth/Subcomponents/AuthSC";
import { cn } from "@/lib/utils";

// ── FormSelect ───────────────────────────────────────────────────────────────
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

function FormSelect({ label, options, className, ...rest }: FormSelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <select
        {...rest}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm text-gray-700 transition-all duration-200 outline-none",
          rest.value === "" ? "text-gray-400" : "text-gray-700",
          className
        )}
        style={{
          borderColor: focused ? "#BF8989" : "#d1c4c4",
          boxShadow: focused ? "0 0 0 3px rgba(139,0,0,0.08)" : "none",
        }}
      >
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

// ── Label helper ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-800 mb-1.5">
      {children}
    </label>
  );
}

// ── Main Form ────────────────────────────────────────────────────────────────
const COMPETITION_CATEGORIES = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "digital_art", label: "Digital Art" },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "animation", label: "Animation" },
];

const CONTESTANTS = [
  { value: "contestant_1", label: "Contestant 1" },
  { value: "contestant_2", label: "Contestant 2" },
  { value: "contestant_3", label: "Contestant 3" },
];

export default function DigitalSubmissionsForm() {
  const [category, setCategory] = useState("");
  const [contestant, setContestant] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!category || !contestant || !driveLink) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#ede8e8] px-8 py-10">

          {/* Heading */}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1 tracking-tight">
            Submit Your Digital Creations
          </h2>

          {/* Instructions */}
          <ul className="mt-4 mb-8 space-y-1.5 text-sm text-gray-600 list-none">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#8B0000]">•</span>
              <span>
                Please rename your files as:{" "}
                <span className="font-semibold text-gray-800">
                  Category_School_ContestantName
                </span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#8B0000]">•</span>
              <span>
                All digital submissions must be uploaded before{" "}
                <span className="font-semibold text-gray-800">
                  June 14th, 2026 at 11:59 PM
                </span>
              </span>
            </li>
          </ul>

          {/* Fields */}
          <div className="space-y-5">
            {/* Competition Category */}
            <div>
              <FieldLabel>Competition Category</FieldLabel>
              <FormSelect
                label="Select Competition Category"
                options={COMPETITION_CATEGORIES}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Contestant */}
            <div>
              <FieldLabel>Contestant</FieldLabel>
              <FormSelect
                label="Select Contestant"
                options={CONTESTANTS}
                value={contestant}
                onChange={(e) => setContestant(e.target.value)}
              />
            </div>

            {/* Drive Link */}
            <div>
              <FieldLabel>Drive Link</FieldLabel>
              <FormInput
                label="Paste your Drive Link Here"
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Ensure the link has "Anyone with the link" access enabled.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!category || !contestant || !driveLink}
              className="relative px-10 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 overflow-hidden"
              style={{
                background:
                  !category || !contestant || !driveLink
                    ? "#b0a0a0"
                    : submitted
                    ? "#2d7a3a"
                    : "#2c2424",
                cursor:
                  !category || !contestant || !driveLink
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  !category || !contestant || !driveLink
                    ? "none"
                    : "0 2px 12px rgba(44,36,36,0.18)",
              }}
            >
              {submitted ? "✓ Entry Submitted!" : "Submit Entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}