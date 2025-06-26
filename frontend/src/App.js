import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlockchainCheck from "./pages/admin/BlockchainCheck";
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Genel giriş ekranı */}
        <Route path="/" element={<EntryPage />} />

        {/* Kullanıcı işlemleri */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Kullanıcı paneli (korumalı) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin paneli (korumalı) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blockchain-check"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <BlockchainCheck />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
