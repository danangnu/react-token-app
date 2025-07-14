import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react";

interface TokenPayload {
  name: string;
  role?: string;
  exp: number;
}

interface Props {
  children: JSX.Element;
  role?: string; // 👈 allow optional role check
}

const RequireAuth = ({ children, role }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.setItem("flash", "Session expired. Please log in again.");
      return <Navigate to="/" replace />;
    }

    // ✅ Role check
    if (role && decoded.role !== role) {
      return <Navigate to="/403" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    localStorage.setItem("flash", "Invalid session.");
    return <Navigate to="/" replace />;
  }
};

export default RequireAuth;
