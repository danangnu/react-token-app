import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await api.post("/auth/register", { username, password });
        const token = response.data.token;
        localStorage.setItem("token", token); // 👈 auto-login
        navigate("/dashboard"); // 👈 redirect immediately
    } catch (err: any) {
        setMessage(err.response?.data || "Registration failed.");
    }
    };


  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Register
      </button>
    </form>
  );
}

export default Register;
