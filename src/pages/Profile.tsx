import { getUserFromToken } from "../services/auth";

const Profile = () => {
  const user = getUserFromToken();

  if (!user) {
    return <p className="text-center mt-10 text-red-600">Session expired. Please log in again.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <p className="mb-2"><strong>Username:</strong> {user.name}</p>
      <p className="mb-4"><strong>Role:</strong> {user.role}</p>
      <p className="text-sm text-gray-500">Token expires at: {new Date(user.exp * 1000).toLocaleString()}</p>
    </div>
  );
};

export default Profile;
