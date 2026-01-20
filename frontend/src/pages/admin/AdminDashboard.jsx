import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Badge, Spinner, Alert } from '../../components/ui';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  const { stats, recentActivity, popularArticles } = dashboardData;

  return (
    <div className="container admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          System overview and management tools
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{stats.totalArticles}</h3>
            <p>Total Articles</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.publishedArticles}</h3>
            <p>Published</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.draftArticles}</h3>
            <p>Drafts Pending</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✍️</div>
          <div className="stat-content">
            <h3>{stats.totalWriters}</h3>
            <p>Writers</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3>{stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/articles">
            <Button variant="primary">Manage Articles</Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="secondary">Manage Users</Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="secondary">View Analytics</Button>
          </Link>
          <Link to="/admin/audit-logs">
            <Button variant="secondary">Audit Logs</Button>
          </Link>
        </div>
      </Card>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <Card className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{activity.userId?.username || 'Unknown'}</strong>
                    {' '}
                    {getActivityText(activity.action)}
                  </p>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Articles */}
        <Card className="popular-articles">
          <h2>Popular Articles</h2>
          <div className="article-list">
            {popularArticles.map((item, index) => (
              <div key={index} className="popular-article-item">
                <div className="article-rank">#{index + 1}</div>
                <div className="article-info">
                  <h4>{item.articleId?.title || 'Untitled'}</h4>
                  <p className="article-author">
                    by {item.articleId?.author?.username || 'Unknown'}
                  </p>
                  <div className="article-stats">
                    <span className="view-count">{item.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
const getActivityIcon = (action) => {
  const icons = {
    CREATE_ARTICLE: '📝',
    EDIT_ARTICLE: '✏️',
    PUBLISH_ARTICLE: '🚀',
    DELETE_ARTICLE: '🗑️',
    LOGIN: '🔐',
    REGISTER: '👤'
  };
  return icons[action] || '📋';
};

const getActivityText = (action) => {
  const texts = {
    CREATE_ARTICLE: 'created an article',
    EDIT_ARTICLE: 'edited an article',
    PUBLISH_ARTICLE: 'published an article',
    DELETE_ARTICLE: 'deleted an article',
    LOGIN: 'logged in',
    REGISTER: 'registered'
  };
  return texts[action] || 'performed an action';
};

export default AdminDashboard;