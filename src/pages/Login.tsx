import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const flash = localStorage.getItem("flash");
    if (flash) {
      setMessage(flash);
      localStorage.removeItem("flash");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setMessage("Login failed.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const res = await api.post("/auth/google-login", { idToken: googleToken });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage("Google login failed.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      const AppleID = (window as any).AppleID;
      if (!AppleID) {
        setMessage("Apple SDK not loaded.");
        return;
      }

      AppleID.auth.init({
        clientId: "com.your.bundle.id", // 🔁 Replace with your Service ID
        scope: "name email",
        redirectURI: "https://your-frontend.com", // 🔁 Must match your Apple config
        usePopup: true,
      });

      const response = await AppleID.auth.signIn();
      const idToken = response.authorization.id_token;

      const res = await api.post("/auth/apple-login", { identityToken: idToken });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Apple login failed.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {message && (
        <div className="relative bg-red-100 text-red-700 border border-red-300 rounded px-4 py-3 mb-4">
          {message}
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="absolute top-1 right-2 text-lg font-bold leading-none focus:outline-none"
          >
            ×
          </button>
        </div>
      )}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>

      <div className="my-4 text-center text-gray-500">or</div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google Login Error")}
          />
        </div>

        <button
          type="button"
          onClick={handleAppleLogin}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition flex justify-center items-center gap-2"
        >
           Sign in with Apple
        </button>
      </div>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600 underline">
          Register here
        </a>
      </p>
    </form>
  );
}

export default Login;
