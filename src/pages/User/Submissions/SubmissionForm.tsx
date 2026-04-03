"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  competitionCategory: z.string({
    required_error: "Please select a competition category.",
  }),
  contestant: z.string({
    required_error: "Please select a contestant.",
  }),
  driveLink: z
    .string()
    .min(1, { message: "Drive link is required." })
    .url({ message: "Please enter a valid URL." }),
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
];

const CONTESTANTS = [
  { value: "contestant-1", label: "Contestant 01" },
  { value: "contestant-2", label: "Contestant 02" },
  { value: "contestant-3", label: "Contestant 03" },
  { value: "contestant-4", label: "Contestant 04" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DigitalSubmissionsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driveLink: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      {/* ── Form ── */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Competition Category */}
          <FormField
            control={form.control}
            name="competitionCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Competition Catergory
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className="
                        h-12 w-full rounded-lg border border-gray-300
                        bg-white px-4 text-sm text-gray-400
                        shadow-none ring-0
                        focus:ring-0 focus:border-gray-400
                        focus-visible:ring-0 focus-visible:outline-none
                      "
                    >
                      <SelectValue placeholder="Select Competition Category" />
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

          {/* Contestant */}
          <FormField
            control={form.control}
            name="contestant"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Contestant
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className="
                        h-12 w-full rounded-lg border border-gray-300
                        bg-white px-4 text-sm text-gray-400
                        shadow-none ring-0
                        focus:ring-0 focus:border-gray-400
                        focus-visible:ring-0 focus-visible:outline-none
                      "
                    >
                      <SelectValue placeholder="Select Contestant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-lg border border-gray-200 shadow-md">
                    {CONTESTANTS.map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="text-sm cursor-pointer"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Drive Link */}
          <FormField
            control={form.control}
            name="driveLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Drive Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Paste your Drive Link Here"
                    className="
                      h-12 w-full rounded-lg border border-gray-300
                      bg-white px-4 text-sm placeholder:text-gray-400
                      shadow-none ring-0
                      focus-visible:ring-0 focus-visible:border-gray-400
                      focus-visible:outline-none
                    "
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Ensure the link has "Anyone with the link" access enabled.
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="
                w-48 h-11 rounded-lg
                bg-gray-900 hover:bg-gray-800
                text-white text-sm font-medium
                tracking-wide
              "
            >
              Submit Entry
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}