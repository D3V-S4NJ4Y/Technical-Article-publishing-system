import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, [user]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, dateFilter]);

  const filterArticles = () => {
    let filtered = articles;
    
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.author?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(article => {
            const articleDate = new Date(article.publishedAt || article.createdAt);
            return articleDate >= filterDate;
          });
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(article => {
            const articleDate = new Date(article.publishedAt || article.createdAt);
            return articleDate >= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(article => {
            const articleDate = new Date(article.publishedAt || article.createdAt);
            return articleDate >= filterDate;
          });
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(article => {
            const articleDate = new Date(article.publishedAt || article.createdAt);
            return articleDate >= filterDate;
          });
          break;
      }
    }
    
    setFilteredArticles(filtered);
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles');
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
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

  const handleShareArticle = (article) => {
    const url = `${window.location.origin}/articles/${article._id}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + '...',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setMessage('Article link copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      });
    }
  };

  if (loading) {
    return <div className="container loading">Loading articles...</div>;
  }

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles;
  const publishedArticles = displayArticles.filter(a => a.status === 'published');
  const draftArticles = displayArticles.filter(a => a.status === 'draft');

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
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0 }}>
            <label>Search Articles</label>
            <input
              type="text"
              placeholder="Search by title, content, tags, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ minWidth: '150px', marginBottom: 0 }}>
            <label>Filter by Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--border-color)',
                borderRadius: '10px',
                fontSize: '16px',
                background: 'var(--bg-white)',
                fontFamily: 'inherit'
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
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
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handlePublish(article._id)}
                      className="btn btn-success"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Publish
                    </button>
                  )}
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
                {user?.role === 'admin' ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
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
                    <button
                      onClick={() => handleDelete(article._id, article.title)}
                      className="btn btn-danger"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleShareArticle(article)}
                      className="btn btn-success"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Share
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                    <Link 
                      to={`/articles/${article._id}`} 
                      className="btn btn-primary" 
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Read More
                    </Link>
                    <button
                      onClick={() => handleShareArticle(article)}
                      className="btn btn-secondary"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Share
                    </button>
                  </div>
                )}
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


