import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LikeButton = ({ articleId }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikeStatus();
  }, [articleId]);

  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(`/api/likes/${articleId}`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      // If not authenticated, just show like count without user status
      if (error.response?.status === 401) {
        setLiked(false);
        // Still try to get like count for public view
        try {
          const publicResponse = await axios.get(`/api/likes/${articleId}`);
          setLikeCount(publicResponse.data.likeCount || 0);
        } catch (e) {
          setLikeCount(0);
        }
      } else {
        console.error('Error fetching like status:', error);
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like articles');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/likes/${articleId}`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`like-button ${liked ? 'liked' : ''}`}
      title={liked ? 'Unlike' : 'Like'}
    >
      <span className="like-icon">
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton;