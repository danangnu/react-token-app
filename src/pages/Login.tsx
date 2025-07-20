import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaApple } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    google: any;
  }
}

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${baseUrl}/auth/login`, { email, password });

        if (res.status === 200) {
        const { token, ...user } = res.data;
        login(user, token); // Store in context + localStorage
        navigate("/dashboard");
        }
    } catch {
        alert("Invalid credentials");
    }
    };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.error("Google login popup blocked");
        }
      });
    }
  };

  const handleAppleLogin = () => {
    alert("Apple login not yet implemented");
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">Forgot password?</p>

        <hr className="my-6 border-gray-700" />

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white text-black font-medium py-2 rounded-md hover:bg-gray-100"
          >
            <img src="/google-logo.png" alt="Google" className="h-5 w-5 mr-3" />
            Continue with Google
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
