import React, { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click 'Register' in the navigation, choose your role (Reader, Writer, or Admin), and fill in your details."
    },
    {
      question: "What's the difference between user roles?",
      answer: "Readers can browse articles, Writers can create drafts, and Admins can publish and manage all content."
    },
    {
      question: "How do I publish an article?",
      answer: "Only Admins can publish articles. Writers create drafts that need admin approval for publication."
    },
    {
      question: "What are the minimum requirements for articles?",
      answer: "Articles need a minimum of 5 characters for title and 10 characters for content."
    },
    {
      question: "Can I edit my published articles?",
      answer: "Writers can only edit their draft articles. Admins can edit any article regardless of status."
    },
    {
      question: "How do I add tags to my articles?",
      answer: "When creating or editing an article, use the tags field and separate multiple tags with commas."
    },
    {
      question: "Can I delete my articles?",
      answer: "Only Admins have the ability to delete articles. Writers cannot delete their own articles."
    },
    {
      question: "How does the search function work?",
      answer: "Search works across article titles, content, tags, and author names. You can also filter by date ranges."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard security measures. See our Privacy Policy for detailed information."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us through the Contact page or email support@techarticles.com"
    }
  ];

  return (
    <div className="container">
      <div className="card">
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to common questions about TechArticles.</p>
        
        <div style={{ marginTop: '32px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'var(--bg-light)',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {faq.question}
                <span style={{ fontSize: '20px' }}>
                  {openFAQ === index ? '−' : '+'}
                </span>
              </button>
              {openFAQ === index && (
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-white)',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <p style={{ margin: 0, lineHeight: '1.6' }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: 'var(--bg-light)', borderRadius: '8px' }}>
          <h3>Still have questions?</h3>
          <p>Can't find the answer you're looking for?</p>
          <a href="/contact" className="btn btn-primary">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;