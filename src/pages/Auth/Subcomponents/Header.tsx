export default function Header() {
  return (
    <header className="fixed z-10 px-6 pt-6 md:px-10 md:pt-8 flex-shrink-0">
      <div className="flex md:justify-start justify-center">
        {/* REPLACE_SAMBHASHA_LOGO */}
        <img
          src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/sambhasha-logo.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL3NhbWJoYXNoYS1sb2dvLndlYnAiLCJpYXQiOjE3NzQ5NTYyMzgsImV4cCI6MTgwNjQ5MjIzOH0.gcyvRLaqUXqqk1I-8R8URHoWBnzF7uCVbhut2jMX7dM"
          alt="Sambhasha"
          className="h-12 md:h-14 object-contain"
        />
      </div>
    </header>
  );
}
