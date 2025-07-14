import { useState } from "react";

function IssueToken() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!recipient || !amount) {
      setMessage("Recipient and amount are required.");
      return;
    }

    try {
      setMessage("Token issued successfully.");
      setRecipient("");
      setAmount("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage(err.response?.data || "Error issuing token.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Issue Token</h2>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipient Username"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Token
        </button>
      </form>
    </div>
  );
}

export default IssueToken;
