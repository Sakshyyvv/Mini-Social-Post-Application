import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const { data } = await api.get(`/posts?page=${pageNum}&limit=5`);
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setPagination(data.pagination);
      setPage(pageNum);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const loadMore = () => {
    if (pagination?.hasMore && !loadingMore) {
      fetchPosts(page + 1, true);
    }
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        <CreatePost onPostCreated={handlePostCreated} />

        <section className="feed-section">
          <h2>Public Feed</h2>

          {loading && <p className="loading-text">Loading posts...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && posts.length === 0 && (
            <div className="empty-state card">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          )}

          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
            ))}
          </div>

          {pagination?.hasMore && (
            <button
              type="button"
              className="btn btn-outline load-more"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More Posts'}
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Feed;
