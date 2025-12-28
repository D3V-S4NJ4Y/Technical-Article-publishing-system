import express from 'express';
import jwt from 'jsonwebtoken';
import Article from '../models/Article.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /articles → Writer
router.post('/', authenticate, authorize('writer', 'admin'), async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Validate status - writers can only create drafts
    const validStatuses = ['draft', 'published'];
    let articleStatus = 'draft'; // default
    
    if (status && validStatuses.includes(status)) {
      if (req.user.role === 'writer' && status === 'published') {
        return res.status(403).json({ message: 'Only admins can publish articles' });
      }
      articleStatus = status;
    }

    const article = new Article({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
      status: articleStatus,
    });

    // Set publishedAt if status is published
    if (articleStatus === 'published') {
      article.publishedAt = new Date();
    }

    await article.save();
    await article.populate('author', 'username email');

    res.status(201).json({ message: 'Article created successfully', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /articles → Public (only published articles), but include drafts/private for authenticated writers/admins
router.get('/', async (req, res) => {
  try {
    let query = { status: 'published' };
    
    // If user is authenticated and is writer/admin, also include their drafts and private articles
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user && (user.role === 'writer' || user.role === 'admin')) {
          // For writers, show published articles + their own drafts + their own private articles
          // For admins, show all articles
          if (user.role === 'writer') {
            query = {
              $or: [
                { status: 'published' },
                { status: 'draft', author: user._id }
              ]
            };
          } else if (user.role === 'admin') {
            // Admins see all articles
            query = {};
          }
        }
      } catch (error) {
        // Invalid token, just show published articles
      }
    }

    const articles = await Article.find(query)
      .populate('author', 'username email')
      .sort({ status: 1, publishedAt: -1, createdAt: -1 }); // Sort: published first, then by date

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /articles/:id → Public (only if published)
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'username email');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // If not published, check if user is author or admin
    if (article.status !== 'published') {
      // Check if user is authenticated and is author or admin
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'Article is not published or is private' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || (user._id.toString() !== article.author._id.toString() && user.role !== 'admin')) {
          return res.status(403).json({ message: 'Access denied. This article is not published or is private' });
        }
      } catch (error) {
        return res.status(403).json({ message: 'Article is not published or is private' });
      }
    }

    res.json({ article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /articles/:id → Writer (own article), Admin
router.put('/:id', authenticate, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check permissions: writer can only edit their own draft articles, admin can edit any
    if (req.user.role !== 'admin' && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own articles' });
    }
    
    // Writers can only edit draft articles
    if (req.user.role === 'writer' && article.status === 'published') {
      return res.status(403).json({ message: 'You cannot edit published articles' });
    }

    const { title, content, tags, status } = req.body;

    if (title) article.title = title;
    if (content) article.content = content;
    if (tags) article.tags = tags;

    // Allow status change for writers (their own draft articles) and admins
    if (status) {
      const validStatuses = ['draft', 'published'];
      if (validStatuses.includes(status)) {
        // Writers can only set draft, admins can set any status
        if (req.user.role === 'writer' && status === 'published') {
          return res.status(403).json({ message: 'Only admins can publish articles' });
        }
        
        const oldStatus = article.status;
        article.status = status;
        
        // Set publishedAt when status changes to published
        if (status === 'published' && oldStatus !== 'published') {
          article.publishedAt = new Date();
        }
        // Clear publishedAt when status changes from published
        if (oldStatus === 'published' && status !== 'published') {
          article.publishedAt = null;
        }
      }
    }

    await article.save();
    await article.populate('author', 'username email');

    res.json({ message: 'Article updated successfully', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /articles/:id → Admin only
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /articles/:id/publish → Admin
router.patch('/:id/publish', authenticate, authorize('admin'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.status = 'published';
    article.publishedAt = new Date();

    await article.save();
    await article.populate('author', 'username email');

    res.json({ message: 'Article published successfully', article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Additional route: Get all articles (for writers/admins to see their own articles)
router.get('/my/articles', authenticate, authorize('writer', 'admin'), async (req, res) => {
  try {
    // Both writers and admins see only their own articles
    const query = { author: req.user._id };

    const articles = await Article.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin route: Get all articles (for admin dashboard to manage all articles)
router.get('/admin/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Admin can see all articles
    const articles = await Article.find({})
      .populate('author', 'username email')
      .sort({ status: 1, publishedAt: -1, createdAt: -1 });

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

