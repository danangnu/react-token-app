import { Navigate } from "react-router-dom";
import { getUserRole } from "../services/auth"; // Assume you store role in token
import type { JSX } from "react";

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const role = getUserRole();
  return role === "admin" ? children : <Navigate to="/403" />;
};

export default RequireAdmin;
