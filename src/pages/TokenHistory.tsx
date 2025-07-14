import { useEffect, useState } from "react";
import api from "../services/api";
import { getLoggedInUsername } from "../services/auth";
import { exportToCsv } from "../utils/csvExport";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Token {
  id: number;
  issuerUsername: string;
  recipientUsername: string;
  amount: number;
  status: string;
  issuedAt: string;
}

const TokenHistory = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const username = getLoggedInUsername();

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await api.get(`/token/mine?username=${username}`);
      setTokens(res.data);
    };
    fetchHistory();
  }, [username]);

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setStatusFilter("all");
  };

  const filteredTokens = tokens.filter((t) => {
    const tokenDate = new Date(t.issuedAt);
    const isAfterStart = !fromDate || tokenDate >= new Date(fromDate);
    const isBeforeEnd = !toDate || tokenDate <= new Date(toDate + "T23:59:59");
    const statusMatch = statusFilter === "all" || t.status === statusFilter;
    return isAfterStart && isBeforeEnd && statusMatch;
  });

  const summary = {
    sent: 0,
    received: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  };

  filteredTokens.forEach((t) => {
    const isSent = t.issuerUsername === username;
    if (isSent) summary.sent += 1;
    else summary.received += 1;

    if (t.status === "accepted") summary.accepted += 1;
    else if (t.status === "rejected") summary.rejected += 1;
    else if (t.status === "pending") summary.pending += 1;
  });

  const handleExport = () => {
    const csvData = filteredTokens.map((t) => ({
      Direction: t.issuerUsername === username ? "Sent" : "Received",
      User:
        t.issuerUsername === username ? t.recipientUsername : t.issuerUsername,
      Amount: t.amount,
      Status: t.status,
      Date: new Date(t.issuedAt).toLocaleString(),
    }));
    exportToCsv("token-history.csv", csvData);
  };

  const chartData = [
    { name: "Accepted", count: summary.accepted },
    { name: "Rejected", count: summary.rejected },
    { name: "Pending", count: summary.pending },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Token History</h2>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-3 py-2 rounded"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8 text-center">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-blue-800">Sent</h3>
          <p className="text-xl font-bold">{summary.sent}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-green-800">Received</h3>
          <p className="text-xl font-bold">{summary.received}</p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-green-900">Accepted</h3>
          <p className="text-xl font-bold">{summary.accepted}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-red-800">Rejected</h3>
          <p className="text-xl font-bold">{summary.rejected}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
          <p className="text-xl font-bold">{summary.pending}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Tokens by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      {filteredTokens.length === 0 ? (
        <p>No tokens match the selected filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Direction</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((t) => {
                const isSent = t.issuerUsername === username;
                return (
                  <tr key={t.id} className="text-sm">
                    <td className="border px-4 py-2">
                      {isSent ? "Sent" : "Received"}
                    </td>
                    <td className="border px-4 py-2">
                      {isSent ? t.recipientUsername : t.issuerUsername}
                    </td>
                    <td className="border px-4 py-2">{t.amount}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${
                          t.status === "accepted"
                            ? "bg-green-600"
                            : t.status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-gray-500">
                      {new Date(t.issuedAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TokenHistory;
