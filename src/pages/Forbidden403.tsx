import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Forbidden403 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <LockClosedIcon className="w-16 h-16 text-red-600 animate-bounce mb-4" />
      <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Access Denied</h1>
      <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Forbidden403;
