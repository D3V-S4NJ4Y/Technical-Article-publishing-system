import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, [user]);

  const fetchArticles = async () => {
    try {
      // Always fetch articles - backend will return published articles for public,
      // and published + drafts for authenticated writers/admins
      const response = await axios.get('/api/articles');
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container loading">Loading articles...</div>;
  }

  const publishedArticles = articles.filter(a => a.status === 'published');
  const draftArticles = articles.filter(a => a.status === 'draft');
  const privateArticles = articles.filter(a => a.status === 'private');

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1>Articles</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {user && (user.role === 'writer' || user.role === 'admin') 
            ? 'Discover articles and manage your drafts'
            : 'Discover amazing technical content from our expert writers'}
        </p>
      </div>
      {privateArticles.length > 0 && (user?.role === 'writer' || user?.role === 'admin') && (
        <div className="card" style={{ 
          marginBottom: '32px',
          background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
          border: '2px solid rgba(107, 114, 128, 0.3)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            color: '#374151',
            marginBottom: '20px'
          }}>
            Your Private Articles ({privateArticles.length})
          </h2>
          <div className="article-grid">
            {privateArticles.map((article) => (
              <div key={article._id} className="card" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                background: 'white',
                border: '2px solid rgba(107, 114, 128, 0.2)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span className="badge badge-private">Private</span>
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
                  fontSize: '14px'
                }}>
                  <span>Author: {article.author?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
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
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <Link 
                    to={`/articles/${article._id}`} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    View
                  </Link>
                  <Link 
                    to={`/edit-article/${article._id}`} 
                    className="btn btn-primary" 
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {draftArticles.length > 0 && (user?.role === 'writer' || user?.role === 'admin') && (
        <div className="card" style={{ 
          marginBottom: '32px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid rgba(245, 158, 11, 0.3)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            color: '#78350f',
            marginBottom: '20px'
          }}>
            Your Draft Articles ({draftArticles.length})
          </h2>
          <div className="article-grid">
            {draftArticles.map((article) => (
              <div key={article._id} className="card" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                background: 'white',
                border: '2px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span className="badge badge-draft">Draft</span>
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
                  fontSize: '14px'
                }}>
                  <span>Author: {article.author?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>Created: {new Date(article.createdAt).toLocaleDateString()}</span>
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
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <Link 
                    to={`/articles/${article._id}`} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    View
                  </Link>
                  <Link 
                    to={`/edit-article/${article._id}`} 
                    className="btn btn-primary" 
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {publishedArticles.length > 0 && (
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '2px solid rgba(16, 185, 129, 0.3)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            color: '#065f46',
            marginBottom: '20px'
          }}>
            Published Articles ({publishedArticles.length})
          </h2>
          <div className="article-grid">
            {publishedArticles.map((article) => (
              <div key={article._id} className="card" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                background: 'white',
                border: '2px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span className="badge badge-published">Published</span>
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
                  fontSize: '14px'
                }}>
                  <span>Author: {article.author?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
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
                <Link 
                  to={`/articles/${article._id}`} 
                  className="btn btn-primary" 
                  style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {articles.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>No articles yet.</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
            {user && (user.role === 'writer' || user.role === 'admin')
              ? 'Create your first article to get started!'
              : 'Be the first to publish an article!'}
          </p>
          {user && (user.role === 'writer' || user.role === 'admin') && (
            <Link to="/create-article" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              Create Article
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleList;


