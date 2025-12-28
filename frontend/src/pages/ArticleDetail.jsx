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

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      setArticle(response.data.article);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load article');
    } finally {
      setLoading(false);
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

  const canEdit = user && (user.role === 'admin' || (user.role === 'writer' && String(article.author._id) === String(user.id) && (article.status === 'draft' || article.status === 'private')));

  return (
    <div className="container">
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
          {canEdit && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/edit-article/${id}`)}
            >
              Edit Article
            </button>
          )}
        </div>
        <h1 style={{ 
          marginBottom: '24px',
          fontSize: '2.5rem',
          lineHeight: '1.2'
        }}>
          {article.title}
        </h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          marginBottom: '24px',
          padding: '16px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '12px',
          flexWrap: 'wrap'
        }}>
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
        <div
          style={{
            lineHeight: '1.9',
            whiteSpace: 'pre-wrap',
            marginTop: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '1.1rem',
            color: 'var(--text-primary)'
          }}
        >
          {article.content}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

