import React, { useEffect, useState } from 'react';
import api from '../api';
import DebtActivityTimeline from '../components/DebtActivityTimeline';
import DebtGraph from '../components/DebtGraph';
import { useAuth } from '../context/AuthContext';

type DebtSummary = {
  totalDebt?: number | string;
  totalSettled?: number | string;
  totalUnsettled?: number | string;
  activeUsersInDebt?: number | string;
  topDebtorName?: string;
  topCreditorName?: string;
};

const defaultSummary: Required<DebtSummary> = {
  totalDebt: 0,
  totalSettled: 0,
  totalUnsettled: 0,
  activeUsersInDebt: 0,
  topDebtorName: '—',
  topCreditorName: '—',
};

const n = (v: number | string | undefined | null) =>
  Number.isFinite(Number(v)) ? Number(v) : 0;

const fmt = (v: number | string | undefined | null, digits = 2) =>
  n(v).toFixed(digits);

const DebtDashboard: React.FC = () => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();

  const [summary, setSummary] = useState<Required<DebtSummary>>(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token') || '';
      const primary = role === 'admin' ? '/debts/admin/summary' : '/debts/my/summary';
      const fallback = '/debts/summary';

      try {
        const res = await api.get(primary, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data || {};
        setSummary({
          totalDebt: n(data.totalDebt),
          totalSettled: n(data.totalSettled),
          totalUnsettled: n(data.totalUnsettled),
          activeUsersInDebt: n(data.activeUsersInDebt),
          topDebtorName: data.topDebtorName || '—',
          topCreditorName: data.topCreditorName || '—',
        });
      } catch {
        try {
          const res2 = await api.get(fallback, { headers: { Authorization: `Bearer ${token}` } });
          const data = res2.data || {};
          setSummary({
            totalDebt: n(data.totalDebt),
            totalSettled: n(data.totalSettled),
            totalUnsettled: n(data.totalUnsettled),
            activeUsersInDebt: n(data.activeUsersInDebt),
            topDebtorName: data.topDebtorName || '—',
            topCreditorName: data.topCreditorName || '—',
          });
        } catch {
          setError('Failed to load debt summary.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [role]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  const hasAnyData =
    n(summary.totalDebt) + n(summary.totalSettled) + n(summary.totalUnsettled) + n(summary.activeUsersInDebt) > 0;

  return (
    <div className="p-6 text-white space-y-8">
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-bold">Debt Dashboard</h2>
          <span className="text-sm text-gray-400 uppercase tracking-wide">
            {role === 'admin' ? 'Admin View' : 'My View'}
          </span>
        </div>

        {!hasAnyData && (
          <div className="mb-4 text-sm text-gray-400">No summary data yet.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Debt</h3>
            <p className="text-2xl">{fmt(summary.totalDebt)} Tokens</p>
          </div>
          <div className="bg-green-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Settled</h3>
            <p className="text-2xl">{fmt(summary.totalSettled)} Tokens</p>
          </div>
          <div className="bg-red-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Unsettled</h3>
            <p className="text-2xl">{fmt(summary.totalUnsettled)} Tokens</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Active Users in Debt</h3>
            <p className="text-2xl">{n(summary.activeUsersInDebt)}</p>
          </div>
          <div className="bg-yellow-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Top Debtor</h3>
            <p className="text-xl">{summary.topDebtorName || '—'}</p>
          </div>
          <div className="bg-blue-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Top Creditor</h3>
            <p className="text-xl">{summary.topCreditorName || '—'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Debt Activity</h3>
        <DebtActivityTimeline />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Debt Relationship Graph</h3>
        <DebtGraph />
      </div>
    </div>
  );
};

export default DebtDashboard;