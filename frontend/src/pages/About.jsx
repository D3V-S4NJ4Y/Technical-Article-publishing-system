import React from 'react';

const About = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>About TechArticles</h1>
        <p>
          TechArticles is a platform dedicated to sharing technical knowledge and insights 
          with developers worldwide. Our mission is to create a community where developers 
          can learn, share, and grow together.
        </p>
        <h2>Our Vision</h2>
        <p>
          To become the leading platform for technical content sharing, fostering 
          innovation and collaboration in the developer community.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Write and publish technical articles</li>
          <li>Role-based access control</li>
          <li>Advanced search and filtering</li>
          <li>Community-driven content</li>
        </ul>
      </div>
    </div>
  );
};

export default About;