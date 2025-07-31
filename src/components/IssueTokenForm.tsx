// src/components/IssueTokenForm.tsx
import React, { useState } from 'react';
import api from '../api'; // <-- axios instance

const IssueTokenForm: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [, setSuccess] = useState(false);
  const [, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const response = await api.post('/token/issue', {
        recipient,
        amount: Number(amount),
        remarks,
        expirationDate,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        setRecipient('');
        setAmount('');
        setExpirationDate('');
        setRemarks('');
      }
    } catch (err: any) {
      setError(err.response?.data || 'Failed to issue token.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span className="text-2xl">🎯</span>
        <span>Issue Token</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Recipient</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Issue Token
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueTokenForm;
