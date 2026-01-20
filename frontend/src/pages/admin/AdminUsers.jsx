import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Badge, Spinner, Alert, Input } from '../../components/ui';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: '', password: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ''
    });
  };

  const handleSave = async (userId) => {
    try {
      const updateData = {
        username: editForm.username,
        email: editForm.email,
        role: editForm.role
      };
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      await axios.put(`/api/admin/users/${userId}`, updateData);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Manage Users</h1>
        <Link to="/admin">
          <Button variant="secondary">← Back to Dashboard</Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="search-section">
        <Input
          type="text"
          placeholder="Search users by username, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="articles-table">
        {filteredUsers.map(user => (
          <Card key={user._id} className="article-row">
            {editingUser === user._id ? (
              <div className="edit-user-form">
                <div className="form-row">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="form-select"
                  >
                    <option value="reader">Reader</option>
                    <option value="writer">Writer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Input
                    type="password"
                    placeholder="New Password (optional)"
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  />
                </div>
                <div className="form-actions">
                  <Button onClick={() => handleSave(user._id)}>Save</Button>
                  <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="article-info">
                  <h3>{user.username}</h3>
                  <p>Email: {user.email} | Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  <Badge variant={user.role === 'admin' ? 'published' : 'draft'}>{user.role}</Badge>
                </div>
                <div className="article-actions">
                  <span>Articles: {user.articleStats?.total || 0}</span>
                  <span>Published: {user.articleStats?.published || 0}</span>
                  <Button variant="secondary" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button 
                    variant="danger" 
                    onClick={() => setDeleteConfirm(user._id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <p>{searchTerm ? 'No users found matching your search.' : 'No users found.'}</p>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user? This will also delete all their articles.</p>
            <div className="modal-actions">
              <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;