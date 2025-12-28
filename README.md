# Technical Article Publishing System

A full-stack MERN (MongoDB, Express, React, Node.js) application for publishing technical articles with role-based access control.

## Features

- **Three User Roles:**
  - **Admin**: Review, publish, and delete articles
  - **Writer**: Create and edit their own draft articles
  - **Reader**: Browse and read published articles

- **Article Management:**
  - Create articles in draft status
  - Edit articles (writers can only edit their own drafts)
  - Publish articles (admin only)
  - Delete articles (admin only)
  - Tag articles for better organization

## Tech Stack

- **Backend:**
  - Node.js & Express.js
  - MongoDB with Mongoose
  - JWT Authentication
  - bcryptjs for password hashing

- **Frontend:**
  - React 18
  - React Router for navigation
  - Axios for API calls
  - Vite for build tooling

## Project Structure

```
Technical Article publishing system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Article.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── articles.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleDetail.jsx
│   │   │   ├── CreateArticle.jsx
│   │   │   ├── EditArticle.jsx
│   │   │   ├── MyArticles.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://sanjay_db_user:XmuwLQjeOHsZR7gw@cluster0.qwa9nyi.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Routes

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Article Routes

- `POST /api/articles` - Create article (Writer/Admin only)
- `GET /api/articles` - Get all published articles (Public)
- `GET /api/articles/:id` - Get article by ID (Public if published)
- `PUT /api/articles/:id` - Update article (Writer own article/Admin)
- `DELETE /api/articles/:id` - Delete article (Admin only)
- `PATCH /api/articles/:id/publish` - Publish article (Admin only)
- `GET /api/articles/my/articles` - Get user's articles (Writer/Admin only)

## Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (enum: 'admin', 'writer', 'reader'),
  timestamps
}
```

### Article Model
```javascript
{
  title: String,
  content: String,
  tags: [String],
  author: ObjectId (ref: User),
  status: String (enum: 'draft', 'published'),
  publishedAt: Date,
  timestamps
}
```

## Usage

1. **Register/Login**: Create an account with your desired role (admin, writer, or reader)

2. **Writers**:
   - Create new articles (saved as drafts)
   - Edit your own draft articles
   - View all your articles

3. **Admins**:
   - View all articles (drafts and published)
   - Publish draft articles
   - Delete any article
   - Edit any article

4. **Readers**:
   - Browse published articles
   - Read article details

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based authorization middleware
- Protected API routes
- Writers can only edit their own draft articles

## License

ISC


