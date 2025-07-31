import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface ProfileCardProps {
  username: string;
  name: string;
  email: string;
  role: string;
  expiration?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  name,
  email,
  role,
  expiration,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
      <div className="flex items-center space-x-3 mb-4">
        <UserCircleIcon className="w-6 h-6 text-white" />
        <h2 className="text-lg font-semibold">User Profile</h2>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <p>
          <span className="font-semibold text-white">Username:</span> {username}
        </p>
        <p>
          <span className="font-semibold text-white">Full Name:</span> {name}
        </p>
        <p>
          <span className="font-semibold text-white">Email:</span> {email}
        </p>
        <p>
          <span className="font-semibold text-white">Role:</span> {role}
        </p>
        <p>
          <span className="font-semibold text-white">Token expires in:</span>{' '}
          {expiration || '-'}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;

