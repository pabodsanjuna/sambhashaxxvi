// App.tsx — Root entry point
import { useState } from "react";
import {AuthCard, LoginForm, RegisterForm} from "./Subcomponents/AuthSC";
import {Header, Footer} from "../Subcomponent/FH";

type View = "login" | "register";

export default function Auth() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="relative min-h-screen w-full flex flex-col "
     style={{ backgroundImage: "url('https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/image%2018.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2ltYWdlIDE4LmpwZyIsImlhdCI6MTc3NDk1OTYyOSwiZXhwIjoxODA2NDk1NjI5fQ.tPPZpPT2an8pImIckdntg7eIVeNK60AXWGEqMzvuPZ4')", backgroundSize: "cover" }}>
    <Header />
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <AuthCard>
          {view === "login" ? (
            <LoginForm onGoRegister={() => setView("register")} />
          ) : (
            <RegisterForm onGoLogin={() => setView("login")} />
          )}
        </AuthCard>
      </main>
    <Footer />
    </div>
  );
}
