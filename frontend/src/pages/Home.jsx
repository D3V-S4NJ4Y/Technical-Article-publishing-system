import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)' }}>
        <h1>Welcome to Technical Article Publishing System</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '32px', color: 'var(--text-secondary)' }}>
          A professional platform for writers to create and publish technical articles, with
          admin oversight and reader access.
        </p>
        {!user && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/articles" className="btn btn-secondary">
              Browse Articles
            </Link>
          </div>
        )}
        {user && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['writer', 'admin'].includes(user.role) && (
              <Link to="/create-article" className="btn btn-primary">
                Create Article
              </Link>
            )}
            <Link to="/articles" className="btn btn-secondary">
              Browse Articles
            </Link>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Key Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(99, 102, 241, 0.2)'
          }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--primary-dark)' }}>Writers</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Create and manage your technical articles in draft form. Edit your work before publication.
            </p>
          </div>
          <div style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(236, 72, 153, 0.2)'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#be185d' }}>Admins</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Review and publish articles, manage the complete publishing workflow with full control.
            </p>
          </div>
          <div style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#065f46' }}>Readers</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Browse and read published technical articles. Discover amazing content from expert writers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


