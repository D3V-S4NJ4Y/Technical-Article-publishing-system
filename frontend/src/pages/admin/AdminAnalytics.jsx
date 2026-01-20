import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Alert } from '../../components/ui';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Analytics</h1>
        <Link to="/admin">
          <Button variant="secondary">← Back to Dashboard</Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {analytics && (
        <>
          <Card>
            <h2>Publishing Trends</h2>
            <div className="analytics-grid">
              {analytics.publishingTrends?.map((trend, index) => (
                <div key={index} className="trend-item">
                  <span>{trend._id}</span>
                  <span>{trend.count} articles</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2>Active Writers</h2>
            <div className="writers-list">
              {analytics.activeWriters?.map((writer, index) => (
                <div key={index} className="writer-item">
                  <span>{writer.author?.username}</span>
                  <span>{writer.articleCount} articles</span>
                  <span>{writer.publishedCount} published</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2>Popular Tags</h2>
            <div className="tags-grid">
              {analytics.popularTags?.map((tag, index) => (
                <div key={index} className="tag-item">
                  <span>{tag._id}</span>
                  <span>{tag.count} uses</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;