import express from 'express';
import mongoose from 'mongoose';
import Like from '../models/Like.js';
import Review from '../models/Review.js';
import Article from '../models/Article.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/likes/:articleId - Toggle like
router.post('/:articleId', authenticate, async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user already liked
    const existingLike = await Like.findOne({ user: userId, article: articleId });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ user: userId, article: articleId });
      const likeCount = await Like.countDocuments({ article: articleId });
      return res.json({ liked: false, likeCount });
    } else {
      // Like
      await Like.create({ user: userId, article: articleId });
      const likeCount = await Like.countDocuments({ article: articleId });
      return res.json({ liked: true, likeCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/likes/:articleId - Get like status and count
router.get('/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const authHeader = req.header('Authorization');
    let userId = null;

    // Try to get user ID if authenticated, but don't require it
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id || decoded.userId || decoded._id);
        if (user) {
          userId = user._id;
        }
      } catch (jwtError) {
        // Ignore JWT errors for public access
      }
    }

    const likeCount = await Like.countDocuments({ article: articleId });
    let liked = false;

    if (userId) {
      const userLike = await Like.findOne({ user: userId, article: articleId });
      liked = !!userLike;
    }

    res.json({ liked, likeCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews/:articleId - Add review
router.post('/reviews/:articleId', authenticate, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (comment.length < 10 || comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be between 10 and 500 characters' });
    }

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: userId, article: articleId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this article' });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      article: articleId,
      rating,
      comment: comment.trim()
    });

    await review.populate('user', 'username');

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/:articleId - Get article reviews
router.get('/reviews/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ article: articleId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ article: articleId });
    
    // Fix mongoose aggregation
    const averageRatingResult = await Review.aggregate([
      { $match: { article: new mongoose.Types.ObjectId(articleId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      reviews,
      totalReviews,
      averageRating: averageRatingResult[0]?.avgRating || 0,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/reviews/:reviewId - Update review
router.put('/reviews/update/:reviewId', authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment.trim();

    await review.save();
    await review.populate('user', 'username');

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reviews/:reviewId - Delete review
router.delete('/reviews/:reviewId', authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Review.deleteOne({ _id: reviewId });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;