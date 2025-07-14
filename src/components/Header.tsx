import React from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUsername } from "../services/auth";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const username = getLoggedInUsername();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome{username ? `, ${username}` : ""} 👋
      </h2>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
