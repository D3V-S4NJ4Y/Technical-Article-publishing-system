import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RichTextEditor from '../components/RichTextEditor';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      const article = response.data.article;
      setArticle(article);
      setTitle(article.title);
      setContent(article.content);
      setTags(article.tags.join(', '));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load article');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      setLoading(false);
      return;
    }
    if (textContent.length < 10) {
      setError('Content must be at least 10 characters long');
      setLoading(false);
      return;
    }

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await axios.put(`/api/articles/${id}`, {
        title: title.trim(),
        content: content,
        tags: tagsArray,
      });

      navigate(`/articles/${id}`);
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.map(err => err.msg).join(', '));
      } else {
        setError(error.response?.data?.message || 'Failed to update article');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return <div className="container loading">Loading article...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Edit Article</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update your article content and details</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Article Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter a compelling title for your article"
            />
            <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              Minimum 5 characters required
            </small>
          </div>
          <div className="form-group">
            <label>Content</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your article content here..."
            />
            <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              Minimum 10 characters required ({content.replace(/<[^>]*>/g, '').length}/10)
            </small>
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js, Web Development"
            />
            <small style={{ display: 'block', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Add relevant tags to help readers find your article
            </small>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Updating...' : 'Update Article'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/articles/${id}`)}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;


