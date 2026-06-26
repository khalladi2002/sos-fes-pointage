import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Secteurs from './pages/Secteurs';
import Agents from './pages/Agents';
import Responsables from './pages/Responsables';
import Pointage from './pages/Pointage';
import Historique from './pages/Historique';
import Rapports from './pages/Rapports';
import { useAuth } from './context/AuthContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-sos-gray">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pointage"
        element={
          <ProtectedRoute>
            <Layout>
              <Pointage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/historique"
        element={
          <ProtectedRoute>
            <Layout>
              <Historique />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rapports"
        element={
          <ProtectedRoute>
            <Layout>
              <Rapports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/secteurs"
        element={
          <ProtectedRoute roles={['admin']}>
            <Layout>
              <Secteurs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents"
        element={
          <ProtectedRoute roles={['admin']}>
            <Layout>
              <Agents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsables"
        element={
          <ProtectedRoute roles={['admin']}>
            <Layout>
              <Responsables />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}
