import mongoose from 'mongoose';

const articleAnalyticsSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  uniqueViews: {
    type: Number,
    default: 0
  },
  totalReadTime: {
    type: Number,
    default: 0 // in seconds
  },
  averageReadTime: {
    type: Number,
    default: 0 // in seconds
  },
  lastViewed: {
    type: Date,
    default: null
  },
  viewHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
articleAnalyticsSchema.index({ articleId: 1 });
articleAnalyticsSchema.index({ views: -1 });
articleAnalyticsSchema.index({ lastViewed: -1 });

const ArticleAnalytics = mongoose.model('ArticleAnalytics', articleAnalyticsSchema);

export default ArticleAnalytics;