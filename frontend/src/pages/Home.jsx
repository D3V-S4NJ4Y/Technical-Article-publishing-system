import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="hero">
        <h1>Technical Article Publishing System</h1>
        <p>
          A professional platform where writers craft technical content, admins manage publication,
          and readers discover high‑quality articles.
        </p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/articles" className="btn btn-secondary">Browse Articles</Link>
          </div>
        )}
        {user && (
          <div className="hero-actions">
            {['writer', 'admin'].includes(user.role) && (
              <Link to="/create-article" className="btn btn-primary">Create Article</Link>
            )}
            <Link to="/articles" className="btn btn-secondary">Browse Articles</Link>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Key Roles</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Writers</h3>
            <p>
              Create and manage your technical articles in draft form. Edit your work before publication.
            </p>
          </div>
          <div className="feature-card">
            <h3>Admins</h3>
            <p>
              Review and publish articles, manage the complete publishing workflow with full control.
            </p>
          </div>
          <div className="feature-card">
            <h3>Readers</h3>
            <p>
              Browse and read published technical articles. Discover amazing content from expert writers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


