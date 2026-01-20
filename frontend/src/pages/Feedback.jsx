import React, { useState } from 'react';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    type: 'general',
    rating: 5,
    message: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedback({ type: 'general', rating: 5, message: '', email: '' });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Feedback</h1>
        <p>Help us improve TechArticles! Your feedback is valuable to us.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Feedback Type</label>
            <select
              value={feedback.type}
              onChange={(e) => setFeedback({...feedback, type: e.target.value})}
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="content">Content Quality</option>
              <option value="ui">User Interface</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Overall Rating</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback({...feedback, rating: star})}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: star <= feedback.rating ? '#fbbf24' : '#d1d5db'
                  }}
                >
                  ⭐
                </button>
              ))}
              <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>
                {feedback.rating}/5 stars
              </span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Your Feedback</label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback({...feedback, message: e.target.value})}
              required
              placeholder="Tell us what you think..."
              style={{ minHeight: '120px' }}
            />
          </div>
          
          <div className="form-group">
            <label>Email (Optional)</label>
            <input
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback({...feedback, email: e.target.value})}
              placeholder="your@email.com (for follow-up)"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Submit Feedback</button>
        </form>
        
        <div style={{ marginTop: '32px' }}>
          <h3>Other Ways to Share Feedback</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-light)', borderRadius: '8px', textAlign: 'center' }}>
              <h4>💬 Community</h4>
              <p>Join discussions in our community forums</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-light)', borderRadius: '8px', textAlign: 'center' }}>
              <h4>📧 Direct Email</h4>
              <p>feedback@techarticles.com</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-light)', borderRadius: '8px', textAlign: 'center' }}>
              <h4>🐦 Social Media</h4>
              <p>Follow us for updates and discussions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;