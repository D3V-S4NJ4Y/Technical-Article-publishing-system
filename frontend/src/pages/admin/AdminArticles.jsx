import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Spinner, Alert, Input } from '../../components/ui';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/articles/admin/all');
      setArticles(response.data.articles || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load articles');
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

  const handleDelete = async (articleId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    
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
    return (
      <div className="container">
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Manage Articles</h1>
        <Link to="/admin">
          <Button variant="secondary">← Back to Dashboard</Button>
        </Link>
      </div>

      {message && <Alert variant={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <div className="search-section">
        <Input
          type="text"
          placeholder="Search articles by title, author, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="articles-table">
        {filteredArticles.map(article => (
          <Card key={article._id} className="article-row">
            <div className="article-info">
              <h3>{article.title}</h3>
              <p>By: {article.author?.username} | Created: {new Date(article.createdAt).toLocaleDateString()}</p>
              <Badge variant={article.status}>{article.status}</Badge>
            </div>
            <div className="article-actions">
              <Link to={`/articles/${article._id}`}>
                <Button variant="secondary" size="sm">View</Button>
              </Link>
              <Link to={`/edit-article/${article._id}`}>
                <Button variant="primary" size="sm">Edit</Button>
              </Link>
              {article.status === 'draft' && (
                <Button variant="success" size="sm" onClick={() => handlePublish(article._id)}>
                  Publish
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={() => handleDelete(article._id, article.title)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <p>{searchTerm ? 'No articles found matching your search.' : 'No articles found.'}</p>
        </Card>
      )}
    </div>
  );
};

export default AdminArticles;