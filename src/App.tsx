import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./pages/Auth/Auth";
import LoginForm from "./pages/Auth/Subcomponents/LoginForm";
import RegisterForm from "./pages/Auth/Subcomponents/RegisterForm";
import ResetPassword from "./pages/Auth/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AuthLayout wraps the routes to maintain the background, Header, and Footer */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}