import { useEffect, useState } from "react";
import api from "../services/api";

interface Summary {
  totalUsers: number;
  totalTokens: number;
  issued: number;
  pending: number;
  rejected: number;
}

const AdminDashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await api.get("/admin/summary");
      setSummary(res.data);
    };
    fetchSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-blue-800">Total Users</h3>
          <p className="text-2xl font-bold">{summary.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-green-800">Total Tokens</h3>
          <p className="text-2xl font-bold">{summary.totalTokens}</p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-green-900">Issued</h3>
          <p className="text-2xl font-bold">{summary.issued}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
          <p className="text-2xl font-bold">{summary.pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-red-800">Rejected</h3>
          <p className="text-2xl font-bold">{summary.rejected}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
