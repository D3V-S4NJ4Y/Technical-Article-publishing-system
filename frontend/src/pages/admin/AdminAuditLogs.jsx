import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Alert } from '../../components/ui';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/audit-logs');
      setLogs(response.data.logs || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Audit Logs</h1>
        <Link to="/admin">
          <Button variant="secondary">← Back to Dashboard</Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="articles-table">
        {logs.map(log => (
          <Card key={log._id} className="article-row">
            <div className="article-info">
              <h3>{getActionIcon(log.action)} {log.action.replace('_', ' ')}</h3>
              <p>User: {log.userId?.username || 'Unknown'} | {new Date(log.timestamp).toLocaleString()}</p>
              <p>IP: {log.ipAddress}</p>
            </div>
            <div className="article-actions">
              <span>{log.resourceType}</span>
            </div>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <Card>
          <p>No audit logs found.</p>
        </Card>
      )}
    </div>
  );
};

export default AdminAuditLogs;