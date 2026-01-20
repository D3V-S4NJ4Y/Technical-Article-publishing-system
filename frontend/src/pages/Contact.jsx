import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              style={{ minHeight: '120px' }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
        
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <h3>Other Ways to Reach Us</h3>
          <p>📧 support@techarticles.com</p>
          <p>📱 +1 (555) 123-4567</p>
          <p>📍 123 Tech Street, Developer City, DC 12345</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;