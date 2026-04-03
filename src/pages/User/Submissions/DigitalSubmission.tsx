import SubmissionsForm from "./SubmissionForm";


export default function DigitalSubmissions() {
  return (
    // Pro-tip: I changed `min-h-screen` to `h-full` here. 
    // Since this is rendering inside your MainRender layout, using min-h-screen 
    // would cause unnecessary double-scrollbars in the dashboard.
    <div className="h-full w-full bg-gray-50 flex items-center justify-center p-6 font-sans">
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

          {/* Render the Form Logic */}
          <SubmissionsForm />

        </div>
      </div>
    </div>
  );
}