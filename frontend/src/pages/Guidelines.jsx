import React from 'react';

const Guidelines = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>Writing Guidelines</h1>
        <p>Follow these guidelines to create high-quality technical articles that engage and educate our community.</p>
        
        <h2>📝 Content Standards</h2>
        <div style={{ marginBottom: '24px' }}>
          <h3>Technical Accuracy</h3>
          <ul>
            <li>Ensure all code examples are tested and working</li>
            <li>Provide accurate technical information</li>
            <li>Include version numbers for tools and frameworks</li>
            <li>Cite sources for external information</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h3>Article Structure</h3>
          <ul>
            <li><strong>Title:</strong> Clear, descriptive (minimum 5 characters)</li>
            <li><strong>Introduction:</strong> Brief overview of what readers will learn</li>
            <li><strong>Main Content:</strong> Step-by-step explanations (minimum 10 characters)</li>
            <li><strong>Conclusion:</strong> Summary and next steps</li>
          </ul>
        </div>
        
        <h2>✍️ Writing Style</h2>
        <div style={{ marginBottom: '24px' }}>
          <h3>Tone and Voice</h3>
          <ul>
            <li>Write in a clear, conversational tone</li>
            <li>Use active voice when possible</li>
            <li>Explain technical concepts in simple terms</li>
            <li>Be inclusive and welcoming to all skill levels</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h3>Formatting</h3>
          <ul>
            <li>Use headings to organize content</li>
            <li>Include code blocks for examples</li>
            <li>Add bullet points for lists</li>
            <li>Keep paragraphs concise (3-4 sentences)</li>
          </ul>
        </div>
        
        <h2>🏷️ Tagging Best Practices</h2>
        <ul>
          <li>Use relevant, specific tags (e.g., "React", "JavaScript", "API")</li>
          <li>Include 3-5 tags per article</li>
          <li>Use consistent tag naming (check existing tags)</li>
          <li>Avoid overly generic tags like "programming"</li>
        </ul>
        
        <h2>🚫 Content Restrictions</h2>
        <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ color: '#dc2626', marginTop: 0 }}>Prohibited Content</h3>
          <ul style={{ marginBottom: 0 }}>
            <li>Plagiarized or copied content</li>
            <li>Spam or promotional material</li>
            <li>Offensive or discriminatory language</li>
            <li>Misleading or false information</li>
            <li>Content that violates copyright</li>
          </ul>
        </div>
        
        <h2>✅ Review Process</h2>
        <div style={{ marginBottom: '24px' }}>
          <h3>For Writers</h3>
          <ol>
            <li>Create your article as a draft</li>
            <li>Review and edit your content</li>
            <li>Submit for admin review</li>
            <li>Address any feedback from admins</li>
            <li>Article gets published once approved</li>
          </ol>
        </div>
        
        <h2>💡 Tips for Success</h2>
        <ul>
          <li><strong>Start with an outline:</strong> Plan your article structure</li>
          <li><strong>Include examples:</strong> Show, don't just tell</li>
          <li><strong>Test your code:</strong> Verify all examples work</li>
          <li><strong>Proofread:</strong> Check for spelling and grammar</li>
          <li><strong>Get feedback:</strong> Ask colleagues to review before submitting</li>
        </ul>
        
        <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: 'var(--bg-light)', borderRadius: '8px' }}>
          <h3>Ready to Write?</h3>
          <p>Follow these guidelines to create amazing technical content!</p>
          <a href="/create-article" className="btn btn-primary">Start Writing</a>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;