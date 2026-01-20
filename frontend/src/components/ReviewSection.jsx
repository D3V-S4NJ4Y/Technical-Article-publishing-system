import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ articleId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [articleId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/likes/reviews/${articleId}`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add a review');
      return;
    }

    if (newReview.comment.length < 10) {
      alert('Comment must be at least 10 characters long');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/likes/reviews/${articleId}`, newReview);
      setNewReview({ rating: 5, comment: '' });
      setShowForm(false);
      fetchReviews();
      alert('Review added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive ? () => onRate(star) : undefined}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>Reviews ({totalReviews})</h3>
        {totalReviews > 0 && (
          <div className="average-rating">
            {renderStars(Math.round(averageRating))}
            <span className="rating-text">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
        )}
      </div>

      {user && (
        <div className="add-review">
          {!showForm ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>
              
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this article..."
                  required
                  minLength={10}
                  maxLength={500}
                />
                <small>
                  {newReview.comment.length}/500 characters (min 10)
                </small>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setNewReview({ rating: 5, comment: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.user.username}</strong>
                  {renderStars(review.rating)}
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;