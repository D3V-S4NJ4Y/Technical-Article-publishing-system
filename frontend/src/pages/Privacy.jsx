import React from 'react';

const Privacy = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> January 2024</p>
        
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, write articles, or contact us.</p>
        
        <h3>Personal Information</h3>
        <ul>
          <li>Username and email address</li>
          <li>Profile information</li>
          <li>Articles and comments you publish</li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Process your articles and content</li>
          <li>Send you technical notices and updates</li>
          <li>Respond to your comments and questions</li>
        </ul>
        
        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h2>Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@techarticles.com</p>
      </div>
    </div>
  );
};

export default Privacy;