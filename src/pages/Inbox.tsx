import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Token {
  id: number;
  issuerUsername: string;
  amount: number;
  status: string;
  remarks?: string;
  issuedAt: string;
}

const Inbox: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [message, setMessage] = useState("");

  const loadInbox = async () => {
    const res = await api.get("/token/inbox");
    setTokens(res.data.filter((t: Token) => t.status === "pending"));
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const handleAction = async (id: number, action: "accept" | "decline") => {
    try {
      await api.post(`/token/${action}/${id}`);
      setMessage(`✅ Token ${action}ed.`);
      loadInbox();
    } catch {
      setMessage(`❌ Failed to ${action} token.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Inbox - Pending Tokens</h2>
      {message && <p className="text-sm text-gray-700 mb-4">{message}</p>}
      {tokens.length === 0 ? (
        <p>No pending tokens.</p>
      ) : (
        <ul className="space-y-4">
          {tokens.map((token) => (
            <li key={token.id} className="border rounded p-4">
              <p><strong>From:</strong> {token.issuerUsername}</p>
              <p><strong>Amount:</strong> {token.amount}</p>
              <p><strong>Remarks:</strong> {token.remarks || "-"}</p>
              <p><strong>Issued At:</strong> {new Date(token.issuedAt).toLocaleString()}</p>
              <div className="mt-2 space-x-4">
                <button
                  onClick={() => handleAction(token.id, "accept")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(token.id, "decline")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
