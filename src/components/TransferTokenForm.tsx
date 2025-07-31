import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Token {
  id: number;
  amount: number;
  remarks: string;
}

const TransferTokenForm = () => {
  useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchAcceptedTokens = async () => {
      try {
        const res = await api.get('/token/accepted', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTokens(res.data);
      } catch (err) {
        console.error('Failed to fetch accepted tokens:', err);
      }
    };

    fetchAcceptedTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTokenId || !recipient) {
      alert('Please complete all required fields.');
      return;
    }

    try {
      await api.post('/token/transfer',
        {
          tokenId: selectedTokenId,
          newRecipientUsername: recipient,
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Token transferred successfully');
      setSelectedTokenId(null);
      setRecipient('');
      setRemarks('');
    } catch (err) {
      console.error('Transfer failed:', err);
      alert('Transfer failed.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Transfer Token</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* From Dropdown */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">From</label>
          <select
            value={selectedTokenId || ''}
            onChange={(e) => setSelectedTokenId(Number(e.target.value))}
            className="w-full bg-gray-700 text-white p-2 rounded"
          >
            <option value="">Select Accepted Token</option>
            {tokens.map((token) => (
              <option key={token.id} value={token.id}>
                #{token.id} - {token.amount} token(s)
              </option>
            ))}
          </select>
        </div>

        {/* To and Amount side by side */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-1">To</label>
            <input
              type="text"
              placeholder="Recipient username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-sm text-gray-300 mb-1">Amount</label>
            <input
              type="text"
              disabled
              value={
                selectedTokenId
                  ? `${tokens.find((t) => t.id === selectedTokenId)?.amount ?? ''}`
                  : ''
              }
              className="w-full bg-gray-700 text-white p-2 rounded opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Remarks</label>
          <textarea
            rows={3}
            placeholder="Optional remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium"
        >
          Transfer Token
        </button>
      </form>
    </div>
  );
};

export default TransferTokenForm;
