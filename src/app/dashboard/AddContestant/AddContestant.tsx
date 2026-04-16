import AddContestantForm from "./AddContestantForm";

export default function AddContestant() {
  return (
    <div className="h-full w-full flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg px-8 sm:py-5 md:py-1 py-5">
        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          Register Contestant
        </h2>
        <p className="text-center text-xs text-gray-500 mb-6">
          Notice : You Cannot Modify Contestant Data After Registration. Please Finalize Details Before Submitting. 
          For any Inquiries, <a href="mailto:sambhasha26@nccustudios.com" className="text-blue-500 hover:underline">
            Contact Admins
          </a>
        </p>

        {/* Form Logic */}
        <AddContestantForm />
      </div>
    </div>
  );
}