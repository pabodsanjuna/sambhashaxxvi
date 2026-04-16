export default function SubmissionInstructions() {
  return (
    <>
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
            All submissions must be uploaded before{" "}
            <span className="font-semibold text-gray-800">
              June 14th 2026 at 11:59 PM
            </span>
          </span>
        </li>
      </ul>
    </>
  );
}