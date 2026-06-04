import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?');

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const isLiked = post.likes?.some(
    (like) => String(like.userId) === String(user?.id)
  );

  const handleLike = async () => {
    setLoadingLike(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      onUpdate(data);
    } catch (err) {
      console.error(err.response?.data?.message || 'Like failed');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoadingComment(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, { text: commentText.trim() });
      setCommentText('');
      setShowComments(true);
      onUpdate(data);
    } catch (err) {
      console.error(err.response?.data?.message || 'Comment failed');
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <article className="card post-card">
      <header className="post-header">
        <div className="avatar">{getInitial(post.author?.username)}</div>
        <div>
          <p className="post-author">{post.author?.username}</p>
          <p className="post-date">{formatDate(post.createdAt)}</p>
        </div>
      </header>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.imageUrl && (
        <div className="post-image-wrap">
          <img src={post.imageUrl} alt="Post" className="post-image" />
        </div>
      )}

      <div className="post-stats">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {post.likes?.length > 0 && (
        <p className="liked-by">
          Liked by: {post.likes.map((l) => l.username).join(', ')}
        </p>
      )}

      <div className="post-actions">
        <button
          type="button"
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loadingLike}
        >
          {isLiked ? '❤️ Liked' : '🤍 Like'}
        </button>
        <button
          type="button"
          className="action-btn"
          onClick={() => setShowComments((prev) => !prev)}
        >
          💬 Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments?.length === 0 && <p className="no-comments">No comments yet.</p>}
          {post.comments?.map((comment) => (
            <div key={comment._id} className="comment">
              <strong>{comment.username}</strong>
              <span>{comment.text}</span>
            </div>
          ))}
        </div>
      )}

      <form className="comment-form" onSubmit={handleComment}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          maxLength={500}
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={loadingComment}>
          {loadingComment ? '...' : 'Send'}
        </button>
      </form>
    </article>
  );
};

export default PostCard;
