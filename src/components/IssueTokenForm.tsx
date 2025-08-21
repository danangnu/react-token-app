// src/components/IssueTokenForm.tsx
import React, { useCallback, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import api from "../api"; // your axios instance

// What the select holds and submits
type OptionType = {
  value: string; // <-- username (required by backend)
  label: string; // <-- what user sees (Name (username • email))
};

/** Normalize one user row from any reasonable backend shape */
function toOption(u: any): OptionType | null {
  // Derive username from common variants; fallback to email's local-part
  const username: string | undefined =
    u?.username ??
    u?.userName ??
    u?.user_name ??
    u?.login ??
    (typeof u?.email === "string" ? u.email.split("@")[0] : undefined);

  if (!username) return null;

  const name: string =
    u?.name ??
    u?.fullName ??
    u?.displayName ??
    u?.profileName ??
    username;

  const email: string | undefined = u?.email ?? u?.emailAddress ?? u?.mail;

  const base = `${name} (${username}`;
  const label = email ? `${base} • ${email})` : `${base})`;

  return { value: String(username), label };
}

/** Small debounce helper for loadOptions to limit requests while typing */
function debouncePromise<F extends (...args: any[]) => Promise<any>>(fn: F, ms = 250) {
  let timer: any;
  let pending: { resolve: (v: any) => void; reject: (e: any) => void } | null = null;
  return (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> =>
    new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer);
      pending = { resolve, reject };
      timer = setTimeout(() => {
        fn(...args)
          .then((res) => pending?.resolve(res))
          .catch((e) => pending?.reject(e))
          .finally(() => {
            pending = null;
          });
      }, ms);
    });
}

const IssueTokenForm: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState<OptionType | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ---- Async options loader -------------------------------------------------
  const fetchOptions = useCallback(async (inputValue: string): Promise<OptionType[]> => {
    const q = (inputValue ?? "").trim();
    if (q.length < 2) return []; // don't query for 0–1 characters

    try {
      const res = await api.get(`/user/search-users`, {
        params: { query: q },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // API might return an array or wrap inside {users|items|data}
      const raw: any[] = Array.isArray(res.data)
        ? res.data
        : res.data?.users ?? res.data?.items ?? res.data?.data ?? [];

      const options = raw
        .map(toOption)
        .filter((o: OptionType | null): o is OptionType => Boolean(o));

      return options;
    } catch (e) {
      console.error("Failed to load users", e);
      return [];
    }
  }, []);

  // Debounced version to reduce chatter while typing
  const loadOptions = useMemo(() => debouncePromise(fetchOptions, 250), [fetchOptions]);

  // ---- Submit ---------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    if (!selectedRecipient) return setError("Please select a recipient.");
    if (!amount || Number(amount) <= 0) return setError("Please enter a valid amount.");

    const payload = {
      recipient: selectedRecipient.value, // username string
      amount: Number(amount),
      remarks: remarks || null,
      expirationDate: expirationDate || null, // backend can accept null
    };

    try {
      const response = await api.post("/token/issue", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 200) {
        setSuccess(true);
        setSelectedRecipient(null);
        setAmount("");
        setExpirationDate("");
        setRemarks("");
      } else {
        setError("Failed to issue token.");
      }
    } catch (err: any) {
      console.error("Issue token failed:", err);
      setError(err?.response?.data ?? "Failed to issue token.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span className="text-2xl">🎯</span>
        <span>Issue Token</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient */}
        <div>
          <label className="block text-sm mb-1 text-white">Recipient</label>
          <AsyncSelect<OptionType, false>
            isClearable
            cacheOptions
            defaultOptions={false} // no initial fetch; only when typing
            loadOptions={loadOptions}
            value={selectedRecipient}
            onChange={(opt) => setSelectedRecipient(opt)}
            getOptionValue={(o) => o.value} // EXPLICIT: never infer
            getOptionLabel={(o) => o.label} // EXPLICIT: never infer
            placeholder="Search by name, username, or email"
            noOptionsMessage={({ inputValue }) =>
              (inputValue ?? "").trim().length < 2
                ? "Type at least 2 characters…"
                : "No users found"
            }
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#374151",
                borderColor: "#4B5563",
              }),
              input: (base) => ({ ...base, color: "#fff" }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              menu: (base) => ({ ...base, backgroundColor: "#1F2937" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#3B82F6" : "#1F2937",
                color: "#fff",
              }),
              placeholder: (base) => ({ ...base, color: "#9CA3AF" }),
            }}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm mb-1 text-white">Amount</label>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Expiration */}
        <div>
          <label className="block text-sm mb-1 text-white">Expiration Date (optional)</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm mb-1 text-white">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Optional notes…"
          />
        </div>

        {/* Messages */}
        {error && <p className="text-red-400 text-sm">{String(error)}</p>}
        {success && <p className="text-green-400 text-sm">Token issued successfully ✅</p>}

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={!selectedRecipient}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
          >
            Issue Token
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueTokenForm;
