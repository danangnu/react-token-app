import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  name: string;
  onLogout: () => void; // logout handler passed from parent
}

const Header: React.FC<HeaderProps> = ({ name, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-6 relative">
      <h2 className="text-2xl font-semibold text-white">
        Welcome, {name} <span role="img" aria-label="wave">👋</span>
      </h2>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-700 transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src="https://randomuser.me/api/portraits/women/75.jpg"
            alt="Profile"
            className="w-9 h-9 rounded-full border border-gray-600 object-cover"
          />
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <ul className="py-1 text-sm text-gray-700">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
