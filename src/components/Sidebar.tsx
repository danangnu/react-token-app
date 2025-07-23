import React, { useState } from 'react';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  InboxArrowDownIcon,
  UserPlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  onLogout: () => void;
  currentView:
    | 'profile'
    | 'history'
    | 'issue'
    | 'sent'
    | 'transfer'
    | 'loops'
    | 'overview';
  setView: (view: SidebarProps['currentView']) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, currentView, setView }) => {
  const [debtExpanded, setDebtExpanded] = useState(true);

  const linkClass = (view: string) =>
    `flex items-center space-x-2 ${
      currentView === view
        ? 'text-blue-500 font-semibold'
        : 'text-white hover:text-blue-400'
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

        {/* 🔽 Collapsible Debt section */}
        <div>
          <button
            onClick={() => setDebtExpanded(!debtExpanded)}
            className="flex items-center space-x-2 text-white hover:text-blue-400"
          >
            {debtExpanded ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
            <span>Debt</span>
          </button>
          {debtExpanded && (
            <div className="ml-6 mt-2 space-y-2">
              <button className={linkClass('loops')} onClick={() => setView('loops')}>
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Detect Loops</span>
              </button>
              <button className={linkClass('overview')} onClick={() => setView('overview')}>
                <DocumentTextIcon className="w-4 h-4" />
                <span>All Debts Overview</span>
              </button>
            </div>
          )}
        </div>

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
