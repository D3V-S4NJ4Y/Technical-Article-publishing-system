import express from 'express';
import Article from '../models/Article.js';
import ArticleAnalytics from '../models/ArticleAnalytics.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import { logActivity } from '../middleware/audit.js';

const router = express.Router();

// GET /admin/dashboard - Admin dashboard statistics
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalUsers,
      totalWriters,
      totalReaders,
      recentActivity
    ] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Article.countDocuments({ status: 'draft' }),
      User.countDocuments(),
      User.countDocuments({ role: 'writer' }),
      User.countDocuments({ role: 'reader' }),
      AuditLog.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'username')
    ]);

    // Get total views from analytics
    const viewsAggregation = await ArticleAnalytics.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsAggregation[0]?.totalViews || 0;

    // Get popular articles
    const popularArticles = await ArticleAnalytics.find()
      .sort({ views: -1 })
      .limit(5)
      .populate({
        path: 'articleId',
        select: 'title author',
        populate: { path: 'author', select: 'username' }
      });

    res.json({
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalUsers,
        totalWriters,
        totalReaders,
        totalViews
      },
      recentActivity,
      popularArticles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/analytics - Detailed analytics
router.get('/analytics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Articles published over time
    const publishingTrends = await Article.aggregate([
      {
        $match: {
          status: 'published',
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most active writers
    const activeWriters = await Article.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$author',
          articleCount: { $sum: 1 },
          publishedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      { $sort: { articleCount: -1 } },
      { $limit: 10 }
    ]);

    // Popular tags
    const popularTags = await Article.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      publishingTrends,
      activeWriters,
      popularTags
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/audit-logs - Audit trail
router.get('/audit-logs', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('userId', 'username email')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /admin/users - User management
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    // Get article counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const articleStats = await Article.aggregate([
          { $match: { author: user._id } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              published: {
                $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
              },
              drafts: {
                $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
              }
            }
          }
        ]);

        return {
          ...user.toObject(),
          articleStats: articleStats[0] || { total: 0, published: 0, drafts: 0 }
        };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /admin/users/:id - Update user
router.put('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const userId = req.params.id;

    // Prevent admin from editing their own role
    if (userId === req.user.id && role && role !== req.user.role) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log activity
    await logActivity(req.user.id, 'USER_UPDATED', {
      targetUserId: userId,
      updatedFields: Object.keys(updateData)
    });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// DELETE /admin/users/:id - Delete user
router.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's articles
    await Article.deleteMany({ author: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    // Log activity
    await logActivity(req.user.id, 'USER_DELETED', {
      targetUserId: userId,
      deletedUser: { username: user.username, email: user.email, role: user.role }
    });

    res.json({ message: 'User and their articles deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;