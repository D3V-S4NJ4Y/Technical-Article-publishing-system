import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = {
    public: [],
    writer: [
      { path: '/create-article', label: 'Write Article' },
      { path: '/my-articles', label: 'My Articles' }
    ],
    admin: [
      { path: '/admin', label: 'Dashboard' },
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/analytics', label: 'Analytics' }
    ]
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Professional Brand */}
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#667eea" className="logo-bg"/>
              <path d="M8 12h16M8 16h16M8 20h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="24" cy="8" r="3" fill="#10B981" className="logo-accent"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">TechPublish</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          {/* Public Links */}
          {navItems.public.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}

          {/* Role-based Links */}
          {user && ['writer', 'admin'].includes(user.role) && (
            <>
              <div className="nav-divider"></div>
              {navItems.writer.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <div className="nav-divider"></div>
              {navItems.admin.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link nav-link-admin ${isActive(item.path) ? 'nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <path d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">
                <span className="user-initial">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </Button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-content">
              {/* Public Links */}
              {navItems.public.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Role-based Links */}
              {user && ['writer', 'admin'].includes(user.role) && (
                <>
                  <div className="mobile-nav-divider" />
                  <div className="mobile-nav-section">Writer Tools</div>
                  {navItems.writer.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-link ${isActive(item.path) ? 'mobile-nav-link-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {user && user.role === 'admin' && (
                <>
                  <div className="mobile-nav-divider" />
                  <div className="mobile-nav-section">Admin Panel</div>
                  {navItems.admin.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-link mobile-nav-link-admin ${isActive(item.path) ? 'mobile-nav-link-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile Auth */}
              {!user && (
                <>
                  <div className="mobile-nav-divider" />
                  <Link
                    to="/login"
                    className="mobile-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-nav-link mobile-nav-cta"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;