import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  name: string;
  role: string;
  exp: number;
}

interface DecodedToken {
  username: string;
  role: string;
  exp: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUserFromToken(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
}

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/"; // Redirect to login or home
}
