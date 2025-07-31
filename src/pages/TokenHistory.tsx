import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface TokenHistoryItem {
  id: string;
  type: string;
  partnerUsername: string;
  amount: number;
  status: string;
  remarks: string;
  issuedAt: string;
}

const TokenHistory = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<TokenHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTokenId, setProcessingTokenId] = useState<string | null>(null);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!user?.username) {
      setError('No user info available');
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/token/history?username=${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setTokens(response.data);
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setError(err.message || 'Error fetching token history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [baseUrl, user]);

  const handleAction = async (tokenId: string, action: 'accept' | 'decline') => {
    try {
      setProcessingTokenId(tokenId);
      await axios.post(
        `${baseUrl}/token/${tokenId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTokens(prev =>
        prev
          ? prev.map(t =>
              t.id === tokenId
                ? { ...t, status: action === 'accept' ? 'accepted' : 'declined' }
                : t
            )
          : null
      );
    } catch (err) {
      console.error(`Failed to ${action} token:`, err);
    } finally {
      setProcessingTokenId(null);
    }
  };


  if (loading) return <div className="text-white p-4">🔄 Loading token history...</div>;
  if (error) return <div className="text-red-500 p-4">❌ {error}</div>;
  if (tokens && tokens.length === 0) return <div className="text-white p-4">📭 No token history available.</div>;

  return (
    <div className="bg-[#1e1e2f] p-6 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-semibold flex items-center mb-6">
        <span className="text-3xl mr-2">📜</span> Token History
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-left text-white">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Partner</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {tokens?.map((token, index) => (
              <tr
                key={index}
                className="border-t border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-2">
                  {new Date(token.issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-2">{token.type}</td>
                <td className="px-4 py-2">{token.partnerUsername || '–'}</td>
                <td className="px-4 py-2">{token.amount}</td>
                <td className="px-4 py-2">
                  {token.status.toLowerCase() === 'pending' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(token.id, 'accept')}
                        disabled={processingTokenId === token.id}
                        className={`px-3 py-1 rounded text-white font-semibold ${
                          processingTokenId === token.id
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(token.id, 'decline')}
                        disabled={processingTokenId === token.id}
                        className={`px-3 py-1 rounded text-white font-semibold ${
                          processingTokenId === token.id
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="capitalize">{token.status}</span>
                  )}
                </td>
                <td className="px-4 py-2">{token.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenHistory;
