import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/store';
import { Layout } from './components/Layout';
import { useAuth, AuthProvider } from './context/AuthContext';

import { DailyDashboard } from './pages/DailyDashboard';
import { Login } from './pages/Login';
import { UpdatePassword } from './pages/UpdatePassword';
import { GoalsManager } from './pages/GoalsManager';
import { VisionBoard } from './pages/VisionBoard';
import { MomentumCalendar } from './pages/MomentumCalendar';
import { Insights } from './pages/Insights';
import { LandingPage } from './pages/LandingPage';
import './index.css';

// Protected Route Component: Only for Authenticated Users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading Align...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <StoreProvider>{children}</StoreProvider>;
};

// CheckAuth Component: For Public Pages (Landing, Login)
// If User -> Redirect to Dashboard
// If Guest -> Show Children
const CheckAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route: Landing Page */}
          <Route path="/" element={
            <CheckAuth>
              <LandingPage />
            </CheckAuth>
          } />

          {/* Public Route: Login */}
          <Route path="/login" element={
            <CheckAuth>
              <Login />
            </CheckAuth>
          } />

          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Protected Routes: App */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DailyDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/goals" element={
            <ProtectedRoute>
              <Layout>
                <GoalsManager />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/vision" element={
            <ProtectedRoute>
              <Layout>
                <VisionBoard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout>
                <MomentumCalendar />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/insights" element={
            <ProtectedRoute>
              <Layout>
                <Insights />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
