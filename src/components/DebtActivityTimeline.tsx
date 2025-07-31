import React, { useEffect, useState } from 'react';
import api from '../api';

interface Activity {
  id: number;
  fromUser: string;
  toUser: string;
  status: string;
  amount: number;
  remarks: string;
  timestamp: string;
}

const DebtActivityTimeline: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    api.get('/debts/activity', {headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }).then((res) => setActivities(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Recent Debt Activity</h2>
      {activities.map((a) => (
        <div
          key={a.id}
          className="p-3 rounded bg-gray-700 border-l-4"
          style={{
            borderColor:
              a.status === 'Settled'
                ? '#16a34a'
                : a.status === 'Partially Repaid'
                ? '#facc15'
                : '#3b82f6'
          }}
        >
          <div className="text-sm text-gray-300 mb-1">
            {new Date(a.timestamp).toLocaleString()}
          </div>
          <div className="font-medium">
            {a.fromUser} → {a.toUser}
          </div>
          <div className="text-sm text-gray-400">
            {a.status} — {a.amount} tokens
          </div>
          {a.remarks && <div className="text-xs text-gray-500">"{a.remarks}"</div>}
        </div>
      ))}
    </div>
  );
};

export default DebtActivityTimeline;
