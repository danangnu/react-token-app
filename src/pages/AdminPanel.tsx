import React from "react";

const AdminPanel: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p className="text-gray-700">Only visible to admin users.</p>
    </div>
  );
};

export default AdminPanel;
