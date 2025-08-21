import React, { useEffect, useState } from 'react';
import api from '../api';

interface SentToken {
  issuedAt: string;
  recipientName: string;
  amount: number;
  status: string;
  remarks: string;
}

const SentTokens: React.FC = () => {
  const [tokens, setTokens] = useState<SentToken[]>([]);

  useEffect(() => {
    const fetchSentTokens = async () => {
      try {
        const res = await api.get('/token/sent', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }); // adjust your backend route
        setTokens(res.data);
      } catch (err) {
        console.error('Failed to fetch sent tokens:', err);
      }
    };

    fetchSentTokens();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <span>📄</span>
        <span>Sent Tokens</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700 text-left text-gray-300">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Recipient</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/30">
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(token.issuedAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-2">{token.recipientName}</td>
                <td className="px-4 py-2">{token.amount}</td>
                <td className="px-4 py-2">{token.status}</td>
                <td className="px-4 py-2">{token.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tokens.length === 0 && (
          <div className="text-gray-400 text-sm mt-4">No sent tokens found.</div>
        )}
      </div>
    </div>
  );
};

export default SentTokens;
