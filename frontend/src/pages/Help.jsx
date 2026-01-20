import React from 'react';

const Help = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>Help Center</h1>
        <p>Find answers to common questions and get help with using TechArticles.</p>
        
        <h2>Getting Started</h2>
        <div style={{ marginBottom: '24px' }}>
          <h3>How to Create an Account</h3>
          <p>1. Click "Register" in the top navigation</p>
          <p>2. Choose your role (Reader, Writer, or Admin)</p>
          <p>3. Fill in your details and submit</p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h3>Writing Your First Article</h3>
          <p>1. Login with a Writer or Admin account</p>
          <p>2. Click "Write Article" in the navigation</p>
          <p>3. Add title (min 5 characters) and content (min 10 characters)</p>
          <p>4. Add relevant tags and submit</p>
        </div>
        
        <h2>User Roles</h2>
        <div style={{ marginBottom: '16px' }}>
          <h3>👤 Reader</h3>
          <p>Browse and read published articles, search and filter content</p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>✍️ Writer</h3>
          <p>Create draft articles, edit your own content, view your articles</p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h3>👑 Admin</h3>
          <p>Full access - publish articles, manage users, view analytics</p>
        </div>
        
        <h2>Article Management</h2>
        <div style={{ marginBottom: '16px' }}>
          <h3>Draft vs Published</h3>
          <p><strong>Draft:</strong> Only visible to author and admins</p>
          <p><strong>Published:</strong> Visible to everyone on the platform</p>
        </div>
        
        <h2>Search & Filters</h2>
        <p>Use the search bar to find articles by:</p>
        <ul>
          <li>Title keywords</li>
          <li>Content text</li>
          <li>Tags</li>
          <li>Author names</li>
        </ul>
        
        <h2>Need More Help?</h2>
        <p>Can't find what you're looking for? <a href="/contact">Contact our support team</a> for personalized assistance.</p>
      </div>
    </div>
  );
};

export default Help;