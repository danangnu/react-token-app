import React, { useState } from "react";
import api from "../services/api";

const IssueToken: React.FC = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirm = window.confirm(
      `Issue ${amount} tokens to ${recipient} with remarks: ${remarks}?`
    );
    if (!confirm) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await api.post("/token/issue", {
        recipientUsername: recipient,
        amount: parseInt(amount),
        remarks,
      });
      setMessage("✅ Token issued successfully.");
      setRecipient("");
      setAmount("");
      setRemarks("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage("❌ Failed to issue token.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Issue Token</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Recipient Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Issue Token
        </button>
        {message && (
          <p className="text-sm mt-2 text-gray-800">{message}</p>
        )}
      </form>
    </div>
  );
};

export default IssueToken;
