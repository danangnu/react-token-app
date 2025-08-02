import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import api from '../api'; // axios instance

interface OptionType {
  value: number;
  label: string;
}

const IssueTokenForm: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState<OptionType | null>(null);
  const [amount, setAmount] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [, setSuccess] = useState(false);
  const [, setError] = useState('');

  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    try {
      const res = await api.get(`/user/search-users?query=${inputValue}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.data.map((user: any) => ({
        value: user.username,
        label: user.display,
      }));
    } catch (err) {
      console.error('Failed to load users:', err);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (!selectedRecipient) {
      setError('Please select a recipient.');
      return;
    }

    try {
      const response = await api.post('/token/issue', {
        recipient: selectedRecipient.value,
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
        setSelectedRecipient(null);
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
          <label className="block text-sm mb-1 text-white">Recipient</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            value={selectedRecipient}
            onChange={(option) => setSelectedRecipient(option)}
            placeholder="Search by name, username, or email"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#374151',
                borderColor: '#4B5563',
                color: '#fff',
              }),
              input: (base) => ({
                ...base,
                color: '#fff',
              }),
              singleValue: (base) => ({
                ...base,
                color: '#fff',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#1F2937',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? '#3B82F6' : '#1F2937',
                color: '#fff',
              }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white">Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-white">Remarks</label>
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
