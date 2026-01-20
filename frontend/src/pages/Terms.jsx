import React from 'react';

const Terms = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>Terms of Service</h1>
        <p><strong>Last updated:</strong> January 2024</p>
        
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using TechArticles, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>User Accounts</h2>
        <ul>
          <li>You must provide accurate and complete information when creating an account</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must not share your account credentials with others</li>
        </ul>
        
        <h2>Content Guidelines</h2>
        <p>When publishing content on our platform, you agree to:</p>
        <ul>
          <li>Provide original, high-quality technical content</li>
          <li>Respect intellectual property rights</li>
          <li>Not publish spam, offensive, or inappropriate content</li>
          <li>Follow our community guidelines</li>
        </ul>
        
        <h2>User Roles</h2>
        <h3>Writers</h3>
        <ul>
          <li>Can create and edit draft articles</li>
          <li>Articles must be reviewed before publication</li>
        </ul>
        
        <h3>Admins</h3>
        <ul>
          <li>Can review and publish articles</li>
          <li>Can moderate content and users</li>
        </ul>
        
        <h2>Prohibited Uses</h2>
        <p>You may not use our service:</p>
        <ul>
          <li>For any unlawful purpose</li>
          <li>To transmit malicious code or viruses</li>
          <li>To harass or abuse other users</li>
          <li>To violate any applicable laws or regulations</li>
        </ul>
        
        <h2>Termination</h2>
        <p>We may terminate or suspend your account at any time for violations of these terms.</p>
        
        <h2>Contact</h2>
        <p>For questions about these Terms, contact us at legal@techarticles.com</p>
      </div>
    </div>
  );
};

export default Terms;