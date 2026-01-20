import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      console.log('=== Frontend Article Fetch Debug ===');
      console.log('Article ID:', id);
      
      // Ensure token is set if user is logged in
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Present' : 'Missing');
      console.log('Current user:', user ? user.username : 'Not logged in');
      
      if (!token || !user) {
        console.log('No token or user - redirecting to login');
        setError('Please login to view this article');
        setLoading(false);
        return;
      }
      
      if (token && !axios.defaults.headers.common['Authorization']) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token set in axios headers');
      }
      
      console.log('Making request to:', `/api/articles/${id}`);
      const response = await axios.get(`/api/articles/${id}`);
      console.log('Article fetched successfully:', response.data.article.title);
      setArticle(response.data.article);
    } catch (error) {
      console.log('Error fetching article:', error.response?.status, error.response?.data?.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please login again to view this article');
      } else {
        setError(error.response?.data?.message || 'Failed to load article');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      await axios.patch(`/api/articles/${id}/publish`);
      setMessage('Article published successfully!');
      fetchArticle(); // Refresh article data
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to publish article');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const shareText = `Check out this article: ${article.title}\n\n${article.content.substring(0, 100)}...\n\nRead more at: ${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: url
      });
    } else {
      // Try WhatsApp first, then fallback to clipboard
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      const newWindow = window.open(whatsappUrl, '_blank');
      
      // If popup blocked, fallback to clipboard
      setTimeout(() => {
        if (!newWindow || newWindow.closed) {
          navigator.clipboard.writeText(shareText).then(() => {
            setMessage('Article text copied to clipboard!');
            setTimeout(() => setMessage(''), 3000);
          });
        }
      }, 1000);
    }
  };

  if (loading) {
    return <div className="container loading">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Article not found'}</div>
      </div>
    );
  }

  const canEdit = user && (user.role === 'admin' || (user.role === 'writer' && String(article.author._id) === String(user.id) && article.status === 'draft'));

  return (
    <div className="container">
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      <div className="card">
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span className={`badge badge-${article.status}`}>
            {article.status === 'published' ? 'Published' : article.status === 'private' ? 'Private' : 'Draft'}
          </span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {canEdit && (
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/edit-article/${id}`)}
              >
                Edit Article
              </button>
            )}
            {user?.role === 'admin' && article.status === 'draft' && (
              <button
                className="btn btn-success"
                onClick={handlePublish}
              >
                Publish Article
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleShare}
            >
              Share Article
            </button>
          </div>
        </div>
        <h1 style={{ 
          marginBottom: '24px',
          fontSize: '2.5rem',
          lineHeight: '1.2'
        }}>
          {article.title}
        </h1>
        <div className="article-meta-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <strong>Author: {article.author?.username || 'Unknown'}</strong>
          </div>
          <span style={{ color: 'var(--text-light)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span>
              {article.publishedAt
                ? `Published: ${new Date(article.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
                : article.status === 'draft' ? (
                  <span style={{ 
                    color: 'var(--warning-color)', 
                    fontWeight: '600'
                  }}>
                    Draft - Awaiting Publication
                  </span>
                ) : 'Not Published'}
            </span>
          </div>
        </div>
        <div style={{ marginBottom: '24px' }}>
          {article.tags.map((tag, index) => (
            <span key={index} className="tag">
{tag}
            </span>
          ))}
        </div>
        <div className="article-content-container">
          {article.content}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

