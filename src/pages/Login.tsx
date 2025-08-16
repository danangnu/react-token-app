import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaApple } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

// Extend window to include google.accounts
declare global {
  interface Window {
    google?: any;
  }
}

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // ⬅️ spinner state for Google button

  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

  // Regular login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/auth/login`, { email, password });
      const { token, ...user } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services
  useEffect(() => {
    if (!document.getElementById("google-client-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-client-script";
      document.body.appendChild(script);
    }
  }, []);

  // Google login
  const handleGoogleLogin = () => {
    if (googleLoading) return; // prevent double-clicks
    if (!window.google || !googleClientId) {
      alert("Google login is not ready.");
      return;
    }

    setGoogleLoading(true);

    try {
      const codeClient = window.google.accounts.oauth2.initCodeClient({
        client_id: googleClientId,
        scope: "openid email profile",
        ux_mode: "popup",
        redirect_uri: "postmessage",
        callback: async (response: { code?: string }) => {
          if (!response?.code) {
            setGoogleLoading(false);
            alert("Google login failed.");
            return;
          }

          try {
            const backendRes = await axios.post(`${baseUrl}/auth/google-login`, {
              code: response.code,
            });

            const { token, ...user } = backendRes.data;
            login(user, token);
            navigate("/dashboard");
          } catch (err) {
            console.error("Google login failed:", err);
            alert("Google login failed.");
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      codeClient.requestCode();
    } catch (e) {
      console.error(e);
      setGoogleLoading(false);
      alert("Google login failed to start.");
    }
  };

  // Apple login placeholder
  const handleAppleLogin = () => {
    alert("Apple login coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="bg-[#2a2a2a] text-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot password?
          </Link>
        </p>

        <hr className="my-6 border-gray-700" />

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className={`w-full flex items-center justify-center bg-white text-black font-medium py-2 rounded-md ${
              googleLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            {googleLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Connecting to Google…
              </>
            ) : (
              <>
                <img src="/google-logo.png" alt="Google" className="h-5 w-5 mr-3" />
                Login with Google
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center bg-black text-white font-semibold py-2 rounded-md hover:bg-neutral-900"
          >
            <FaApple className="mr-2 text-xl" />
            Continue with Apple
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
