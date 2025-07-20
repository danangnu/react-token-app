import React from 'react';

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">
        Welcome, {name} <span role="img">👋</span>
      </h2>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">Profile</span>
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="Profile"
          className="w-9 h-9 rounded-full border-2 border-gray-600 object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
