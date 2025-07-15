import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUsername } from "../services/auth";
import api from "../services/api";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const username = getLoggedInUsername();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [inboxCount, setInboxCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const fetchInboxCount = async () => {
    try {
      const res = await api.get(`/token/inbox?username=${username}`);
      setInboxCount(res.data.length); // assuming data is a list of tokens
    } catch (err) {
      console.error("Failed to fetch inbox count", err);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (username) {
      fetchInboxCount();

      // Optional: refresh badge every 15s
      const interval = setInterval(fetchInboxCount, 15000);
      return () => clearInterval(interval);
    }
  }, [username]);

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
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
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
            <button
              onClick={() => {
                setOpen(false);
                navigate("/issue");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🪙 Issue Token
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/my-tokens");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              📤 My Sent Tokens
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/transfer");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🔁 Transfer Token
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/history");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              📄 Token History
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/inbox");
                setInboxCount(0); // reset badge
              }}
              className="relative block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              📥 Inbox
              {inboxCount > 0 && (
                <span className="absolute top-2 right-4 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {inboxCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
