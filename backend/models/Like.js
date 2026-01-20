import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

// Ensure one like per user per article
likeSchema.index({ user: 1, article: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;