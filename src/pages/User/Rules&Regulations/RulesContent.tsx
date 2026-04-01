import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Updated mock array to accept actual image paths for your PDF pages.
// Replace the '/assets/...' links with your actual file paths or URLs.
const pdfPagePreviews = [
  { id: 1, imageUrl: "https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/Rules1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL1J1bGVzMS5qcGciLCJpYXQiOjE3NzUwNDQ0NjAsImV4cCI6MTgwNjU4MDQ2MH0.3ZbKcgzXigYzS4FD12DP_Xt8scKGPZ2dPT459hnNzvQ", alt: "Rules Page 1" },
  { id: 2, imageUrl: "https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/Rules2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL1J1bGVzMi5qcGciLCJpYXQiOjE3NzUwNDQ0NzIsImV4cCI6MTgwNjU4MDQ3Mn0.p0-3nn5gKmP4LjNYshNebIbvrJPzAgtMXKI_C1QZ-jc", alt: "Rules Page 2" },
  { id: 3, imageUrl: "https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/Rules3.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL1J1bGVzMy5qcGciLCJpYXQiOjE3NzUwNDQ0ODYsImV4cCI6MTgwNjU4MDQ4Nn0.5wpfV-GxmqaHW41neXyJe_u3Xt_uwI-AnqPzbEWzFRA", alt: "Rules Page 3" },
];

export default function RulesRegulationsContent() {
  const handleDownload = () => {
    // Replace with actual PDF URL/path
    const pdfUrl = "/assets/sambhasha-xxvi-rules-regulations.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "SAMBHASHA_XXVI_Rules_Regulations.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-10 sm:px-8 md:px-12 lg:px-16">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-3">
        Rules and Regulations
      </h1>

      {/* Contact Info */}
      <p className="text-sm text-gray-500 mb-1">For More Information Contact :</p>

      <p className="text-xs md:text-sm font-semibold text-gray-800 text-center leading-relaxed mb-10">
        Kisara Vonal ( President ) - 076 421 5114
        <span className="mx-2 text-gray-400">|</span>
        Nisith Danula ( Treasurer ) -&nbsp; 076 6896 326
      </p>

      {/* PDF Preview Thumbnails */}
      <div className="flex flex-row flex-wrap justify-center gap-3 mb-6 w-full max-w-2xl">
        {pdfPagePreviews.map((page) => (
          <div
            key={page.id}
            className="
              bg-gray-100
              w-[80px] h-[108px]
              sm:w-[140px] sm:h-[192px]
              md:w-[100px] md:h-[130px]
              rounded-sm overflow-hidden
              shadow-md border border-gray-200
              flex flex-col items-center justify-center
              flex-shrink-0
              select-none
            "
          >
            {/* Replaced simulated content with an actual image tag */}
            <img 
              src={page.imageUrl} 
              alt={page.alt} 
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                 // Fallback if the image path is broken/not added yet
                 e.currentTarget.src = "https://via.placeholder.com/160x220.png?text=PDF+Page";
              }}
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 text-center max-w-sm sm:max-w-md leading-relaxed mb-6">
        Download the official PDF containing all rules, regulations,
        <br className="hidden sm:block" />
        and detailed category requirements for SAMBHASHAXXVI.
      </p>

      {/* shadcn/ui Download Button */}
      <Button
        onClick={handleDownload}
        className="
          bg-[#373737] hover:[#373737] active:bg-[#373737]
          text-white text-sm font-medium
          px-7 py-2.5
          rounded-full
          flex items-center gap-2
          transition-colors duration-200
          shadow-sm
        "
      >
        <Download className="w-4 h-4 shrink-0" />
        Download Official PDF
      </Button>
    </div>
  );
}