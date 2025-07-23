import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import DebtActivityTimeline from '../components/DebtActivityTimeline'; // ✅ import

interface DebtSummary {
  totalDebt: number;
  totalSettled: number;
  totalUnsettled: number;
  activeUsersInDebt: number;
  topDebtorName: string;
  topCreditorName: string;
}

const DebtDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DebtSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/debts/summary', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSummary(response.data);
      } catch (err) {
        setError('Failed to load debt summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 text-white space-y-8">
      {/* 🔹 Summary Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Debt Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Debt</h3>
            <p className="text-2xl">{summary?.totalDebt.toFixed(2)} Tokens</p>
          </div>
          <div className="bg-green-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Settled</h3>
            <p className="text-2xl">{summary?.totalSettled.toFixed(2)} Tokens</p>
          </div>
          <div className="bg-red-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Unsettled</h3>
            <p className="text-2xl">{summary?.totalUnsettled.toFixed(2)} Tokens</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Active Users in Debt</h3>
            <p className="text-2xl">{summary?.activeUsersInDebt}</p>
          </div>
          <div className="bg-yellow-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Top Debtor</h3>
            <p className="text-xl">{summary?.topDebtorName}</p>
          </div>
          <div className="bg-blue-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Top Creditor</h3>
            <p className="text-xl">{summary?.topCreditorName}</p>
          </div>
        </div>
      </div>

      {/* 🕘 Activity Timeline */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Debt Activity</h3>
        <DebtActivityTimeline />
      </div>
    </div>
  );
};

export default DebtDashboard;
