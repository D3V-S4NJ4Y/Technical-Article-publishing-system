import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Admin dashboard should show all articles, not just admin's own
      const response = await axios.get('/api/articles/admin/all');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (articleId) => {
    try {
      await axios.patch(`/api/articles/${articleId}/publish`);
      setMessage('Article published successfully!');
      fetchArticles();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to publish article');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await axios.delete(`/api/articles/${articleId}`);
      setMessage('Article deleted successfully!');
      fetchArticles();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete article');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="container loading">Loading articles...</div>;
  }

  const draftArticles = articles.filter((a) => a.status === 'draft');
  const publishedArticles = articles.filter((a) => a.status === 'published');

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Manage all articles and publishing workflow
        </p>
      </div>
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '2px solid rgba(245, 158, 11, 0.3)'
      }}>
        <h2 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          color: '#78350f'
        }}>
          Draft Articles ({draftArticles.length})
        </h2>
        {draftArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              No draft articles pending review.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {draftArticles.map((article) => (
              <div key={article._id} style={{ 
                padding: '20px', 
                background: 'white',
                border: '2px solid rgba(245, 158, 11, 0.2)', 
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{ marginBottom: '12px' }}>
                  <Link to={`/articles/${article._id}`} style={{ 
                    color: 'var(--text-primary)', 
                    textDecoration: 'none' 
                  }}>
                    {article.title}
                  </Link>
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '12px',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span>Author: {article.author?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                  {article.content.substring(0, 150)}...
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handlePublish(article._id)}
                  >
                    Publish
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(article._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/articles/${article._id}`} className="btn btn-secondary">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        border: '2px solid rgba(16, 185, 129, 0.3)'
      }}>
        <h2 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          color: '#065f46'
        }}>
          Published Articles ({publishedArticles.length})
        </h2>
        {publishedArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              No published articles yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {publishedArticles.map((article) => (
              <div key={article._id} style={{ 
                padding: '20px', 
                background: 'white',
                border: '2px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <h3 style={{ marginBottom: '12px' }}>
                  <Link to={`/articles/${article._id}`} style={{ 
                    color: 'var(--text-primary)', 
                    textDecoration: 'none' 
                  }}>
                    {article.title}
                  </Link>
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '12px',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span>Author: {article.author?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(article._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/articles/${article._id}`} className="btn btn-secondary">
                    View
                  </Link>
                  <Link to={`/edit-article/${article._id}`} className="btn btn-primary">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


