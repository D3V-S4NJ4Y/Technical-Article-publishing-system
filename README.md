# TechPublish - Technical Article Publishing System

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application for publishing and managing technical articles with advanced features like rich text editing, user engagement, and role-based access control.
👉 [Visit Technical Article Publishing System ](https://techarticles-backend.onrender.com/)

## 🚀 Features

### 👥 User Management
- **Three User Roles:**
  - **Reader**: Browse and read published articles, like and review content
  - **Writer**: Create draft articles with rich text editor, manage own content
  - **Admin**: Full platform management, publish articles, user moderation

### 📝 Article Management
- **Rich Text Editor**: Complete WYSIWYG editor with formatting tools
  - Bold, Italic, Underline, Strikethrough
  - Headings (H1, H2, H3)
  - Bullet points and numbered lists
  - Text alignment (Left, Center, Right)
  - Links and images
  - Code blocks and tables
  - Live preview mode
- **Draft System**: Writers create drafts, admins publish
- **Tag System**: Organize articles with relevant tags
- **Search & Filter**: Real-time search by title, content, tags, author
- **Date Filtering**: Filter by Today, Last Week, Last Month, Last Year

### 💬 User Engagement
- **Like System**: Heart-based like/unlike functionality
- **Review System**: 5-star ratings with written comments
- **Real-time Updates**: Live like counts and review displays
- **Public Access**: Anyone can read published articles and see engagement

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark/Light Theme**: Toggle between themes with system preference
- **Professional UI**: Modern gradient design with smooth animations
- **Accessibility**: Screen reader friendly, keyboard navigation

### 🔐 Security & Admin
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Granular permission system
- **Input Validation**: Client and server-side validation
- **Audit Logging**: Track user actions and system events
- **Admin Dashboard**: Complete platform analytics and management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Context API** - State management
- **CSS3** - Modern styling with variables

## 📁 Project Structure

```
TechPublish/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Article.js           # Article schema
│   │   ├── Like.js              # Like system
│   │   ├── Review.js            # Review system
│   │   └── ArticleAnalytics.js  # Analytics tracking
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── articles.js          # Article CRUD operations
│   │   ├── likes.js             # Like & review endpoints
│   │   └── admin.js             # Admin management
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── validation.js        # Input validation
│   │   ├── security.js          # Security headers
│   │   └── audit.js             # Audit logging
│   ├── server.js                # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Responsive navigation
│   │   │   ├── Footer.jsx       # Professional footer
│   │   │   ├── RichTextEditor.jsx # WYSIWYG editor
│   │   │   ├── LikeButton.jsx   # Like functionality
│   │   │   └── ReviewSection.jsx # Review system
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── ArticleList.jsx  # Browse articles
│   │   │   ├── ArticleDetail.jsx # Read articles
│   │   │   ├── CreateArticle.jsx # Rich text creation
│   │   │   ├── EditArticle.jsx  # Edit with rich text
│   │   │   ├── MyArticles.jsx   # User's articles
│   │   │   ├── About.jsx        # About page
│   │   │   ├── Contact.jsx      # Contact form
│   │   │   ├── Privacy.jsx      # Privacy policy
│   │   │   ├── Terms.jsx        # Terms of service
│   │   │   ├── Help.jsx         # Help center
│   │   │   ├── FAQ.jsx          # FAQ with accordion
│   │   │   ├── Guidelines.jsx   # Writing guidelines
│   │   │   ├── Feedback.jsx     # Feedback system
│   │   │   └── admin/           # Admin panel pages
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── ThemeContext.jsx # Theme management
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/D3V-S4NJ4Y/techpublish.git
cd techpublish
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@techpublish.com
ADMIN_PASSWORD=admin123
```

4. **Start Backend Server**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

5. **Frontend Setup** (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## 🎯 Usage Guide

### For Readers
1. Browse published articles without registration
2. Use search and filters to find content
3. Register to like articles and write reviews
4. Rate articles with 5-star system

### For Writers
1. Register with "Writer" role
2. Create articles using rich text editor
3. Format content with professional tools
4. Save as drafts for admin review
5. Manage articles in "My Articles" section

### For Admins
1. Login with admin credentials
2. Access admin dashboard
3. Review and publish draft articles
4. Manage users and content
5. View platform analytics

## 🔐 User Roles & Permissions

| Feature | Reader | Writer | Admin |
|---------|--------|--------| ------|
| Read published articles | ✅ | ✅ | ✅ |
| Like articles | ✅ | ✅ | ✅ |
| Write reviews | ✅ | ✅ | ✅ |
| Create articles | ❌ | ✅ | ✅ |
| Edit own drafts | ❌ | ✅ | ✅ |
| Edit any article | ❌ | ❌ | ✅ |
| Publish articles | ❌ | ❌ | ✅ |
| Delete articles | ❌ | ❌ | ✅ |
| User management | ❌ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ✅ |

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Articles
- `GET /api/articles` - Get published articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article (Writer/Admin)
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article (Admin)
- `PATCH /api/articles/:id/publish` - Publish article (Admin)
- `GET /api/articles/my/articles` - Get user's articles

### Engagement
- `POST /api/likes/:articleId` - Toggle like
- `GET /api/likes/:articleId` - Get like status
- `POST /api/likes/reviews/:articleId` - Add review
- `GET /api/likes/reviews/:articleId` - Get reviews
- `PUT /api/likes/reviews/:reviewId` - Update review
- `DELETE /api/likes/reviews/:reviewId` - Delete review

## 🎨 Features Showcase

### Rich Text Editor
- **WYSIWYG Editing**: What you see is what you get
- **Formatting Tools**: Complete text formatting suite
- **Media Support**: Images and links integration
- **Code Blocks**: Syntax highlighting for code
- **Tables**: Dynamic table creation
- **Live Preview**: Real-time content preview

### Engagement System
- **Like System**: Heart-based reactions
- **Review System**: Star ratings with comments
- **Real-time Updates**: Live engagement metrics
- **Public Visibility**: Engagement visible to all users

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Enhanced**: Full desktop functionality
- **Touch Friendly**: Optimized for touch interfaces

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Deploy from GitHub repository
3. Ensure MongoDB Atlas connection

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure API base URL

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Express.js for the robust backend framework
- Vite for the lightning-fast build tool
- All contributors and users of this platform
