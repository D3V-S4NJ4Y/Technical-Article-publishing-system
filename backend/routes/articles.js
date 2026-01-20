import express from 'express';
import jwt from 'jsonwebtoken';
import Article from '../models/Article.js';
import ArticleAnalytics from '../models/ArticleAnalytics.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateArticle, handleValidationErrors } from '../middleware/validation.js';
import { auditLogger } from '../middleware/audit.js';

const router = express.Router();

// STRICT AUTHORIZATION HELPER - Ensures no permission bypass
const strictAuthorizeArticleEdit = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // CRITICAL: Admin can edit any article
    if (req.user.role === 'admin') {
      req.article = article;
      return next();
    }

    // CRITICAL: Writer can ONLY edit their OWN DRAFT articles
    if (req.user.role === 'writer') {
      if (article.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only edit your own articles' });
      }
      if (article.status === 'published') {
        return res.status(403).json({ message: 'Cannot edit published articles' });
      }
      req.article = article;
      return next();
    }

    // No other roles allowed
    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /articles → Writer, Admin (DRAFT ONLY for writers)
router.post('/', 
  authenticate, 
  authorize('writer', 'admin'),
  validateArticle,
  handleValidationErrors,
  auditLogger('CREATE_ARTICLE', 'ARTICLE'),
  async (req, res) => {
    try {
      const { title, content, tags, status } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      // CRITICAL: Writers can ONLY create DRAFT articles
      let articleStatus = 'draft';
      if (status && req.user.role === 'admin' && status === 'published') {
        articleStatus = 'published';
      } else if (status && req.user.role === 'writer' && status === 'published') {
        return res.status(403).json({ message: 'Writers cannot publish articles directly' });
      }

      const article = new Article({
        title,
        content,
        tags: tags || [],
        author: req.user._id,
        status: articleStatus,
      });

      // Set publishedAt if admin creates published article
      if (articleStatus === 'published') {
        article.publishedAt = new Date();
      }

      await article.save();
      await article.populate('author', 'username email');

      // Create analytics entry for published articles
      if (articleStatus === 'published') {
        await ArticleAnalytics.create({ articleId: article._id });
      }

      res.status(201).json({ message: 'Article created successfully', article });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /articles → Public (PUBLISHED ONLY)
router.get('/', async (req, res) => {
  try {
    // CRITICAL: Only show PUBLISHED articles to public
    const query = { status: 'published' };
    
    // Optional search and filtering
    const { search, tags, author, sortBy = 'newest' } = req.query;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    
    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }

    let sortOptions = { publishedAt: -1 };
    if (sortBy === 'oldest') sortOptions = { publishedAt: 1 };
    if (sortBy === 'title') sortOptions = { title: 1 };

    const articles = await Article.find(query)
      .populate('author', 'username email')
      .sort(sortOptions)
      .limit(50); // Pagination limit

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /articles/my/articles → Writer/Admin (own articles)
router.get('/my/articles', 
  authenticate, 
  authorize('writer', 'admin'), 
  async (req, res) => {
    try {
      const query = { author: req.user._id };

      const articles = await Article.find(query)
        .populate('author', 'username email')
        .sort({ createdAt: -1 });

      res.json({ articles });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /articles/admin/all → Admin ONLY (all articles)
router.get('/admin/all', 
  authenticate, 
  authorize('admin'), 
  async (req, res) => {
    try {
      const articles = await Article.find({})
        .populate('author', 'username email')
        .sort({ status: 1, publishedAt: -1, createdAt: -1 });

      res.json({ articles });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /articles/:id → Public (PUBLISHED) + Author/Admin (DRAFT)
router.get('/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    console.log('=== Article Request Debug ===');
    console.log('Article ID requested:', articleId);
    
    // Validate ObjectId format
    if (!articleId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('❌ Invalid ObjectId format');
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = await Article.findById(articleId).populate('author', 'username email');
    console.log('Article found in DB:', article ? '✅ Yes' : '❌ No');

    if (!article) {
      console.log('❌ Article not found in database');
      return res.status(404).json({ message: 'Article not found' });
    }

    console.log('📄 Article details:');
    console.log('  - Title:', article.title);
    console.log('  - Status:', article.status);
    console.log('  - Author:', article.author?.username || 'Unknown');

    // If article is published, allow everyone
    if (article.status === 'published') {
      console.log('✅ Published article - allowing access');
      // Update view count
      await ArticleAnalytics.findOneAndUpdate(
        { articleId: article._id },
        { 
          $inc: { views: 1 },
          lastViewed: new Date()
        },
        { upsert: true }
      );
      return res.json({ article });
    }

    // If article is draft, check authentication
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    console.log('🔐 Auth header present:', authHeader ? '✅ Yes' : '❌ No');
    console.log('🎫 Token extracted:', token ? '✅ Yes' : '❌ No');
    
    if (!token) {
      console.log('❌ No token provided for draft article');
      return res.status(404).json({ message: 'Article not found' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔓 JWT decoded:', decoded);
      console.log('🔓 JWT user ID:', decoded.id || decoded.userId || decoded._id);
      
      const userId = decoded.id || decoded.userId || decoded._id;
      if (!userId) {
        console.log('❌ No user ID in JWT token');
        return res.status(404).json({ message: 'Article not found' });
      }
      
      const user = await User.findById(userId);
      console.log('👤 User found:', user ? '✅ Yes' : '❌ No');
      
      if (!user) {
        console.log('❌ User not found in database');
        return res.status(404).json({ message: 'Article not found' });
      }

      console.log('👤 User details:');
      console.log('  - Username:', user.username);
      console.log('  - Role:', user.role);
      console.log('  - ID:', user._id.toString());
      
      console.log('🔍 Authorization check:');
      console.log('  - Is Admin?', user.role === 'admin');
      console.log('  - Is Author?', user.username === article.author?.username);

      // Allow admin or article author to view draft
      if (user.role === 'admin' || user.username === article.author?.username) {
        console.log('✅ Access granted!');
        return res.json({ article });
      }
      
      console.log('❌ Access denied - not author or admin');
    } catch (jwtError) {
      console.log('❌ JWT Error:', jwtError.message);
      return res.status(404).json({ message: 'Article not found' });
    }

    console.log('❌ Final access denied');
    return res.status(404).json({ message: 'Article not found' });
  } catch (error) {
    console.log('💥 Server error:', error.message);
    console.log('Stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// PUT /articles/:id → Writer (own draft only), Admin
router.put('/:id', 
  authenticate,
  strictAuthorizeArticleEdit,
  validateArticle,
  handleValidationErrors,
  auditLogger('EDIT_ARTICLE', 'ARTICLE'),
  async (req, res) => {
    try {
      const { title, content, tags, status } = req.body;
      const article = req.article;

      if (title) article.title = title;
      if (content) article.content = content;
      if (tags) article.tags = tags;

      // Status change logic
      if (status) {
        const validStatuses = ['draft', 'published'];
        if (validStatuses.includes(status)) {
          // CRITICAL: Writers cannot publish
          if (req.user.role === 'writer' && status === 'published') {
            return res.status(403).json({ message: 'Writers cannot publish articles' });
          }
          
          const oldStatus = article.status;
          article.status = status;
          
          // Set publishedAt when admin publishes
          if (status === 'published' && oldStatus !== 'published') {
            article.publishedAt = new Date();
            // Create analytics entry
            await ArticleAnalytics.findOneAndUpdate(
              { articleId: article._id },
              {},
              { upsert: true }
            );
          }
        }
      }

      await article.save();
      await article.populate('author', 'username email');

      res.json({ message: 'Article updated successfully', article });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /articles/:id → Admin ONLY
router.delete('/:id', 
  authenticate, 
  authorize('admin'),
  auditLogger('DELETE_ARTICLE', 'ARTICLE'),
  async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);

      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      await Article.findByIdAndDelete(req.params.id);
      await ArticleAnalytics.findOneAndDelete({ articleId: req.params.id });

      res.json({ message: 'Article deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// PATCH /articles/:id/publish → Admin ONLY
router.patch('/:id/publish', 
  authenticate, 
  authorize('admin'),
  auditLogger('PUBLISH_ARTICLE', 'ARTICLE'),
  async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);

      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      article.status = 'published';
      article.publishedAt = new Date();

      await article.save();
      await article.populate('author', 'username email');

      // Create analytics entry
      await ArticleAnalytics.findOneAndUpdate(
        { articleId: article._id },
        {},
        { upsert: true }
      );

      res.json({ message: 'Article published successfully', article });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;

