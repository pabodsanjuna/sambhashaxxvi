import SubmissionsForm from "./SubmissionForm";
import SubmissionInstructions from "./SubmissionInstructions";

export default function DigitalSubmissions() {
  return (
    <div className="h-full w-full -mb-10 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        <SubmissionInstructions />
        <SubmissionsForm />
      </div>
    </div>
  );
}