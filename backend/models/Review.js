import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Ensure one review per user per article
reviewSchema.index({ user: 1, article: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;