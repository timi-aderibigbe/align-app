import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Sparkles,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  LogIn
} from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (user) {
      if (confirm('Sign out?')) signOut();
    } else {
      navigate('/login');
    }
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/vision', icon: Sparkles, label: 'Vision Board' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/calendar', icon: Calendar, label: 'Momentum' },
    { to: '/insights', icon: BarChart2, label: 'Insights' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Sparkles size={24} color="var(--color-primary)" />
          </div>
          <h1 className="logo-text">Align</h1>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleAuth}>
            {user ? <LogOut size={20} /> : <LogIn size={20} />}
            <span>{user ? 'Sign Out' : 'Sign In'}</span>
          </button>
          <button className="nav-item" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-bg);
        }

        .sidebar {
          width: 260px;
          background-color: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg);
          position: fixed;
          height: 100vh;
          z-index: 10;
        }

        .main-content {
          margin-left: 260px;
          flex: 1;
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-xl);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-2xl);
          padding-left: var(--spacing-sm);
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: 0.75rem var(--spacing-md);
          border-radius: 8px;
          color: var(--color-text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
          font-weight: 500;
          font-size: 0.95rem;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }

        .nav-item:hover {
          background-color: var(--color-surface-hover);
          color: var(--color-text-main);
        }

        .nav-item.active {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 60px;
            bottom: 0;
            top: auto;
            flex-direction: row;
            padding: 0 var(--spacing-md);
            border-right: none;
            border-top: 1px solid var(--color-border);
            justify-content: space-between;
          }

          .logo-container, .sidebar-footer, .logo-text {
            display: none;
          }
          
          .nav-menu {
            flex-direction: row;
            justify-content: space-around;
            width: 100%;
          }

          .nav-item {
            flex-direction: column;
            gap: 4px;
            padding: 8px 0;
            font-size: 0.7rem;
            justify-content: center;
          }

          .main-content {
            margin-left: 0;
            padding-bottom: 60px;
          }
        }
      `}</style>
    </div>
  );
};
