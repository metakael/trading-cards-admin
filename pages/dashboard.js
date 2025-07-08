// File: /pages/dashboard.js
import { useState } from 'react';
import Layout from '../components/Layout';
import UserManagement from '../components/UserManagement';
import QuestManagement from '../components/QuestManagement';
import P2PApprovals from '../components/P2PApprovals';
import AppReset from '../components/AppReset';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'quests':
        return <QuestManagement />;
      case 'p2p':
        return <P2PApprovals />;
      case 'reset':
        return <AppReset />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="flex border-b border-gray-300 mb-6">
        <button onClick={() => setActiveTab('users')} className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>User Management</button>
        <button onClick={() => setActiveTab('quests')} className={`py-2 px-4 ${activeTab === 'quests' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Quest Management</button>
        <button onClick={() => setActiveTab('p2p')} className={`py-2 px-4 ${activeTab === 'p2p' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>P2P Approvals</button>
        <button onClick={() => setActiveTab('reset')} className={`py-2 px-4 ${activeTab === 'reset' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500'}`}>App Reset</button>
      </div>
      <div>
        {renderContent()}
      </div>
    </Layout>
  );
}