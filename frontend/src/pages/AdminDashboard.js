import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import UserManagement from './admin/UserManagement';
import BlockchainCheck from './admin/BlockchainCheck';
import AdminWelcome from './admin/AdminWelcome';
import ItemManagement from './admin/ItemManagement';
import TransferLogs from './admin/TransferLogs';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("welcome");

  const renderPage = () => {
    switch (currentPage) {
      case "users":
        return <UserManagement />;
      case "items":
        return <ItemManagement />;
      case "transfers":
        return <TransferLogs />;
      case "blockchain":
        return <BlockchainCheck />;
      default:
        return <AdminWelcome />;
    }
  };

  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="admin-content" style={{ flex: 1, padding: '2rem' }}>
        {renderPage()}
      </div>
    </div>
  );
}
