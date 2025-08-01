import React, { useState } from 'react';
import api from '../api'; // Your centralized axios instance
import { DebtRecord } from '../types/debt';

interface RepayDebtModalProps {
  show: boolean;
  onClose: () => void;
  debt: DebtRecord;
  onRepaySuccess: (updatedDebt: DebtRecord) => void;
}

const RepayDebtModal: React.FC<RepayDebtModalProps> = ({ show, onClose, debt, onRepaySuccess }) => {
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!show) return null;

  const handleRepay = async () => {
    if (repayAmount <= 0 || repayAmount > debt.amount) {
      setError('Repayment amount must be greater than 0 and less than or equal to remaining debt.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/debts/${debt.id}/repay`, { amount: repayAmount },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onRepaySuccess(response.data);
      onClose();
    } catch (err) {
      setError('Failed to process repayment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-white">Repay Debt</h3>
        <p className="text-white mb-2">Debtor: <span className="font-semibold">{debt.debtor}</span></p>
        <p className="text-white mb-2">Creditor: <span className="font-semibold">{debt.creditor}</span></p>
        <p className="text-white mb-4">Remaining Amount: <span className="font-semibold">{debt.amount}</span> tokens</p>

        <input
          type="number"
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          placeholder="Enter repayment amount"
          value={repayAmount}
          onChange={(e) => setRepayAmount(Number(e.target.value))}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            onClick={handleRepay}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Repay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepayDebtModal;