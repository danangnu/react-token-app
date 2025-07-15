import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Token {
  id: number;
  issuerUsername: string;
  amount: number;
  status: string;
}

const TransferToken: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/token/inbox").then((res) => {
      const acceptedTokens = res.data.filter((t: Token) => t.status === "accepted");
      setTokens(acceptedTokens);
    });
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokens.find((t) => t.id === selectedTokenId);
    const confirm = window.confirm(
      `Transfer token #${token?.id} to ${recipient}? Remarks: ${remarks}`
    );
    if (!confirm) return;

    try {
      await api.post("/token/transfer", {
        tokenId: selectedTokenId,
        newRecipientUsername: recipient,
        remarks,
      });
      setMessage("✅ Token transferred.");
      setRecipient("");
      setRemarks("");
      setSelectedTokenId(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("❌ Failed to transfer token.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Transfer Token</h2>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Accepted Token</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedTokenId ?? ""}
            onChange={(e) => setSelectedTokenId(Number(e.target.value))}
            required
          >
            <option value="">-- Choose Token --</option>
            {tokens.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.id} from {t.issuerUsername} - Amount: {t.amount}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">New Recipient Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Transfer Token
        </button>
        {message && (
          <p className="text-sm mt-2 text-gray-800">{message}</p>
        )}
      </form>
    </div>
  );
};

export default TransferToken;
