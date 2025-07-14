import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
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
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
      <p className="text-sm text-center mt-4">
        Don’t have an account? <a href="/register" className="text-blue-600 underline">Register here</a>
      </p>
    </form>
  );
}

export default Login;
