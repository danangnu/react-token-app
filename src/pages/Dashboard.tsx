import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import TokenHistory from './TokenHistory';
import IssueTokenForm from '../components/IssueTokenForm';
import SentTokenList from './SentTokens';
import TransferTokenForm from '../components/TransferTokenForm';
import DetectLoopsPage from './DetectLoopsPage';
import AllDebtsPage from './AllDebtsPage'; // ✅ NEW

import {
  UserPlusIcon,
  InboxArrowDownIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Add 'overview' to view type
  const [view, setView] = useState<
    'profile' | 'history' | 'issue' | 'sent' | 'transfer' | 'loops' | 'overview'
  >('profile');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} currentView={view} setView={setView} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Header name={user?.name || user?.username || ''} />

        {/* Top Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              view === 'issue' ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setView('issue')}
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Issue Token</span>
          </button>
          <button
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              view === 'sent' ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setView('sent')}
          >
            <InboxArrowDownIcon className="w-4 h-4" />
            <span>Sent Tokens</span>
          </button>
          <button
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              view === 'transfer' ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setView('transfer')}
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Transfer Token</span>
          </button>
          <button
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              view === 'history' ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setView('history')}
          >
            <DocumentTextIcon className="w-4 h-4" />
            <span>Token History</span>
          </button>
        </div>

        {/* Dynamic Component Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          {view === 'profile' && user && (
            <ProfileCard
              username={user.username}
              role={user.role}
              email={user.email}
              name={user.name}
              expiration={user.expiration}
            />
          )}

          {view === 'history' && <TokenHistory />}
          {view === 'issue' && <IssueTokenForm />}
          {view === 'sent' && <SentTokenList />}
          {view === 'transfer' && <TransferTokenForm />}
          {view === 'loops' && <DetectLoopsPage />}
          {view === 'overview' && <AllDebtsPage />} {/* ✅ NEW VIEW */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
