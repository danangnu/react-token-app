import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${baseUrl}/auth/forgot-password`, { email });
      setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setMessage("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="bg-[#2a2a2a] text-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Forgot password</h2>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter your email, and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="example@example.com"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-black text-white border border-gray-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-400">{message}</p>
        )}

        <p className="text-sm text-center mt-6 text-gray-400">
          <Link to="/login" className="text-blue-400 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
