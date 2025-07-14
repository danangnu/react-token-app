import { useEffect, useState } from "react";
import api from "../services/api";
import { getLoggedInUsername } from "../services/auth";

interface Token {
  id: number;
  issuerUsername: string;
  recipientUsername: string;
  amount: number;
  status: string;
  issuedAt: string;
}

const MyTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [message, setMessage] = useState("");
  const username = getLoggedInUsername();

  const fetchTokens = async () => {
    const res = await api.get(`/token/mine?username=${username}`);
    setTokens(res.data);
  };

  const respondToToken = async (id: number, status: "accepted" | "rejected") => {
    try {
      await api.post("/token/respond", {
        id,
        recipientUsername: username,
        status,
      });
      setMessage(`Token ${status}`);
      fetchTokens(); // refresh list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage(err.response?.data || "Action failed");
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Tokens</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {tokens.length === 0 ? (
        <p>No tokens found.</p>
      ) : (
        <ul className="space-y-4">
          {tokens.map((t) => (
            <li key={t.id} className="border p-4 rounded">
              <p><strong>From:</strong> {t.issuerUsername}</p>
              <p><strong>Amount:</strong> {t.amount}</p>
              <p><strong>Status:</strong> <span className={`font-medium ${t.status === "pending" ? "text-yellow-600" : t.status === "accepted" ? "text-green-600" : "text-red-600"}`}>{t.status}</span></p>
              <p className="text-sm text-gray-500">Issued: {new Date(t.issuedAt).toLocaleString()}</p>

              {t.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => respondToToken(t.id, "accepted")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToToken(t.id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTokens;
