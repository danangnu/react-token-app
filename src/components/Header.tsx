import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUsername } from "../services/auth";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const username = getLoggedInUsername();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome{username ? `, ${username}` : ""} 👋
      </h2>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="text-blue-600 font-medium hover:underline focus:outline-none"
        >
          Profile ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              👤 View Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
