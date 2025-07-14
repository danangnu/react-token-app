import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  name: string; // this matches ClaimTypes.Name from .NET
  exp: number;
}

export function getLoggedInUsername(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded.name;
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/"; // Redirect to login or home
}
