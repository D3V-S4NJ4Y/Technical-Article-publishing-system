import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles/my/articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId, articleTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
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

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1>My Articles</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Manage and track all your articles
        </p>
      </div>
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      {articles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>You haven't created any articles yet.</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '24px' }}>
            Start sharing your knowledge with the world!
          </p>
          <Link to="/create-article" className="btn btn-primary">
            Create Your First Article
          </Link>
        </div>
      ) : (
        <div className="article-grid">
          {articles.map((article) => (
            <div key={article._id} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <span className={`badge badge-${article.status}`}>
                  {article.status === 'published' ? 'Published' : article.status === 'private' ? 'Private' : 'Draft'}
                </span>
              </div>
              <h2 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>
                <Link to={`/articles/${article._id}`} style={{ 
                  color: 'var(--text-primary)', 
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {article.title}
                </Link>
              </h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '16px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                flexWrap: 'wrap'
              }}>
                <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                {article.publishedAt && (
                  <>
                    <span>•</span>
                    <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <p style={{ 
                marginBottom: '16px', 
                color: 'var(--text-secondary)',
                flexGrow: 1,
                lineHeight: '1.7'
              }}>
                {article.content.substring(0, 150)}...
              </p>
              <div style={{ marginBottom: '16px' }}>
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">
{tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                <Link to={`/articles/${article._id}`} className="btn btn-primary" style={{ flex: '1 1 auto', minWidth: '100px' }}>
                  View
                </Link>
                <Link to={`/edit-article/${article._id}`} className="btn btn-secondary" style={{ flex: '1 1 auto', minWidth: '100px' }}>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article._id, article.title)}
                  className="btn btn-danger"
                  style={{ flex: '1 1 auto', minWidth: '100px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticles;


