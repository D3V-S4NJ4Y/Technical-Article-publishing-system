import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      setLoading(false);
      return;
    }
    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters long');
      setLoading(false);
      return;
    }

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const response = await axios.post('/api/articles', {
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray,
      });

      navigate(`/articles/${response.data.article._id}`);
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.map(err => err.msg).join(', '));
      } else {
        setError(error.response?.data?.message || 'Failed to create article');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Create New Article</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Share your technical knowledge with the world</p>
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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your article content here..."
              style={{ minHeight: '300px' }}
            />
            <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              Minimum 10 characters required ({content.length}/10)
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
              {loading ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;


