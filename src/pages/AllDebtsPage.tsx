import React, { useEffect, useState } from 'react';
import DebtActivityTimeline from '../components/DebtActivityTimeline';
import RepayDebtModal from '../components/RepayDebtModal'; // ✅ Import modal
import api from '../api'; // ✅ Centralized API client
import { DebtRecord } from '../types/debt';

const AllDebtsPage: React.FC = () => {
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Modal state
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);
  const [showRepayModal, setShowRepayModal] = useState(false);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const response = await api.get('/debts/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDebts(response.data);
      } catch (err) {
        console.error('Failed to load debts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, []);

  const handleSettle = async (id: number) => {
    try {
      await api.post(`/debts/${id}/settle`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      setDebts((prev) =>
        prev.map((debt) =>
          debt.id === id ? { ...debt, isSettled: true } : debt
        )
      );
    } catch (err) {
      console.error('Failed to settle debt:', err);
    }
  };

  const openRepayModal = (debt: DebtRecord) => {
    setSelectedDebt(debt);
    setShowRepayModal(true);
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
        <span>📋</span>
        <span>All Debts Overview</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 💰 Debts Table */}
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow">
          {loading ? (
            <p>Loading debts...</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-2 px-4">Debtor</th>
                  <th className="py-2 px-4">Creditor</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Remarks</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((debt) => (
                  <tr
                    key={debt.id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="py-2 px-4">{debt.debtor}</td>
                    <td className="py-2 px-4">{debt.creditor}</td>
                    <td className="py-2 px-4">{debt.amount}</td>
                    <td className="py-2 px-4">{debt.remarks || '—'}</td>
                    <td className="py-2 px-4">
                      {debt.isSettled ? (
                        <span className="text-green-400">Settled</span>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleSettle(debt.id)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                          >
                            Settle
                          </button>
                          <button
                            onClick={() => openRepayModal(debt)}
                            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white text-sm"
                          >
                            Repay
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {debts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No debts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 📜 Activity Timeline */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <DebtActivityTimeline />
        </div>
      </div>

      {/* 💳 Repay Modal */}
      {selectedDebt && (
        <RepayDebtModal
          show={showRepayModal}
          onClose={() => setShowRepayModal(false)}
          debt={selectedDebt}
          onRepaySuccess={(updatedDebt: DebtRecord) => {
            setDebts((prev) =>
              prev.map((d) => (d.id === updatedDebt.id ? updatedDebt : d))
            );
          }}
        />
      )}
    </div>
  );
};

export default AllDebtsPage;
