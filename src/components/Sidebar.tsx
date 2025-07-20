import React from 'react';
import { 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  InboxArrowDownIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  onLogout: () => void;
  currentView: 'profile' | 'history' | 'issue' | 'sent' | 'transfer';
  setView: (view: 'profile' | 'history' | 'issue' | 'sent' | 'transfer') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, currentView, setView }) => {
  const linkClass = (view: string) =>
    `flex items-center space-x-2 ${
      currentView === view ? 'text-blue-500 font-semibold' : 'text-white hover:text-blue-400'
    }`;

  return (
    <aside className="w-64 bg-gray-800 p-6 space-y-4">
      <h1 className="text-xl font-bold mb-6">Token Manager</h1>
      <nav className="space-y-3">
        <button className={linkClass('issue')} onClick={() => setView('issue')}>
          <UserPlusIcon className="w-5 h-5" />
          <span>Issue Token</span>
        </button>
        <button className={linkClass('sent')} onClick={() => setView('sent')}>
          <InboxArrowDownIcon className="w-5 h-5" />
          <span>My Sent Tokens</span>
        </button>
        <button className={linkClass('transfer')} onClick={() => setView('transfer')}>
          <ArrowPathIcon className="w-5 h-5" />
          <span>Transfer Token</span>
        </button>
        <button className={linkClass('history')} onClick={() => setView('history')}>
          <DocumentTextIcon className="w-5 h-5" />
          <span>Token History</span>
        </button>
        <button className={linkClass('profile')} onClick={() => setView('profile')}>
          <UserCircleIcon className="w-5 h-5" />
          <span>View Profile</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-gray-300 hover:text-red-500 mt-4"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
