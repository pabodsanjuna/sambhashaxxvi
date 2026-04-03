"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ─── Validation Schema ─────────────────────────────────────────────────────────

const formSchema = z.object({
  contestantName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  competitionCategory: z.string({
    required_error: "Please select a competition category.",
  }),
  dateOfBirth: z.string().min(1, { message: "Date of Birth is required." }),
  contactNumber: z.string().min(10, { message: "Please enter a valid contact number." }),
  nic: z.string().optional(), // Made optional as requested
});

type FormValues = z.infer<typeof formSchema>;

// ─── Sample Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "photography", label: "Photography" },
  { value: "digital-art", label: "Digital Art" },
  { value: "short-film", label: "Short Film" },
  { value: "podcast", label: "Podcast" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "animation", label: "Animation" },
  { value: "announcing", label: "Announcing" },
  { value: "news-reading", label: "News Reading" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AddContestantForm() {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contestantName: "",
      dateOfBirth: "",
      contactNumber: "",
      nic: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Submitting new contestant:", values);
    // Future backend API call goes here
    
    // Simulate successful addition and return to dashboard
    navigate("/dashboard");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* 1st - Contestant's Name */}
        <FormField
          control={form.control}
          name="contestantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Contestant's Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full name"
                  className="
                    h-9 w-full rounded-lg border border-gray-300
                    bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400
                    shadow-none ring-0
                    focus-visible:ring-0 focus-visible:border-gray-400
                    focus-visible:outline-none
                  "
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* 2nd - Competition Category */}
        <FormField
          control={form.control}
          name="competitionCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Competition Category
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="
                      h-12 w-full rounded-lg border border-gray-300
                      bg-white px-4 text-sm text-gray-900
                      shadow-none ring-0
                      focus:ring-0 focus:border-gray-400
                      focus-visible:ring-0 focus-visible:outline-none
                    "
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-lg border border-gray-200 shadow-md">
                  {CATEGORIES.map((cat) => (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      className="text-sm cursor-pointer"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Grid for DOB and Contact Number to save space and look clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 3rd - Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Date of Birth
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="
                      h-9 w-full rounded-lg border border-gray-300
                      bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400
                      shadow-none ring-0
                      focus-visible:ring-0 focus-visible:border-gray-400
                      focus-visible:outline-none
                    "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* 4th - Contact Number */}
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Contact Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="07X XXX XXXX"
                    className="
                      h-9 w-full rounded-lg border border-gray-300
                      bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400
                      shadow-none ring-0
                      focus-visible:ring-0 focus-visible:border-gray-400
                      focus-visible:outline-none
                    "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* 5th - NIC */}
        <FormField
          control={form.control}
          name="nic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                NIC
                <span className="text-gray-400 font-normal ml-1 text-xs">
                  (Optional for Junior & Intermediate)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter NIC Number"
                  className="
                    h-9 w-full rounded-lg border border-gray-300
                    bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400
                    shadow-none ring-0
                    focus-visible:ring-0 focus-visible:border-gray-400
                    focus-visible:outline-none
                  "
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Action Button (Cancel Removed) */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            className="
              w-full sm:w-64 h-10 rounded-full -mt-6 -mb-10
              bg-[#262626] hover:bg-[#373737] active:scale-95 transition-all
              text-white text-sm font-medium tracking-wide shadow-sm
            "
          >
            Add Contestant
          </Button>
        </div>

      </form>
    </Form>
  );
}