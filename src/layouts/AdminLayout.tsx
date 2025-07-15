import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white px-6 py-4">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
