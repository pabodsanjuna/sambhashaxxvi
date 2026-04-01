import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// PDF page mock thumbnails — replace with real thumbnail <img> tags in production
const pdfPagePreviews = [
  { id: 1, isCover: true },
  { id: 2, isCover: false },
  { id: 3, isCover: false },
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
        Rules and Regulations
      </h1>

      {/* Contact Info */}
      <p className="text-sm text-gray-500 mb-1">For More Information Contact :</p>

      <p className="text-sm font-semibold text-gray-800 text-center leading-relaxed mb-10">
        Kisara Vonal ( President ) - 076 421 5114
        <span className="mx-2 text-gray-400">|</span>
        Nisith Danula ( Treasure ) -&nbsp; 077 1485 326
      </p>

      {/* PDF Preview Thumbnails */}
      <div className="flex flex-row flex-wrap justify-center gap-3 mb-6 w-full max-w-2xl">
        {pdfPagePreviews.map((page) => (
          <div
            key={page.id}
            className="
              bg-gray-800
              w-[100px] h-[138px]
              sm:w-[140px] sm:h-[192px]
              md:w-[160px] md:h-[220px]
              rounded-sm overflow-hidden
              shadow-md border border-gray-600
              flex flex-col items-center justify-center
              flex-shrink-0
              select-none
            "
          >
            {/* Inner content simulating PDF page */}
            <div className="flex flex-col items-center justify-between h-full w-full p-2 py-3">
              {/* Top logo text */}
              <div className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-yellow-400 text-[7px] sm:text-[8px] font-semibold tracking-[0.2em] uppercase">
                  SAMBHASHA
                </span>
                <div className="w-10 h-px bg-yellow-500 opacity-50" />
              </div>

              {/* Middle content */}
              <div className="flex flex-col items-center justify-center flex-1 w-full px-2 mt-2 mb-2">
                {page.isCover ? (
                  <div className="text-center">
                    <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase leading-tight">
                      RULES AND
                    </p>
                    <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase leading-tight">
                      REGULATIONS
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-1.5">
                    {[85, 100, 90, 75, 100, 65, 80].map((w, i) => (
                      <div
                        key={i}
                        className="h-[1.5px] bg-gray-500 rounded opacity-70"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom logo */}
              <div className="flex flex-col items-center gap-0.5 w-full">
                <div className="w-10 h-px bg-yellow-500 opacity-50" />
                <span className="text-yellow-400 text-[6px] tracking-[0.3em] uppercase opacity-70">
                  XXVI
                </span>
              </div>
            </div>
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
          bg-gray-900 hover:bg-gray-700 active:bg-gray-800
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