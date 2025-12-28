import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '18px',
            color: 'white'
          }}>
            📝
          </div>
          <h1 style={{ margin: 0 }}>TechArticles</h1>
        </Link>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/articles" onClick={() => setMenuOpen(false)}>Articles</Link>
          {user ? (
            <>
              {['writer', 'admin'].includes(user.role) && (
                <>
                  <Link to="/create-article" onClick={() => setMenuOpen(false)}>Create Article</Link>
                  <Link to="/my-articles" onClick={() => setMenuOpen(false)}>My Articles</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <span>{user.username} ({user.role})</span>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


