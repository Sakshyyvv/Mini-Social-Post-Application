import { useState } from 'react';
import api from '../api/axios';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim() && !image) {
      setError('Add text, an image, or both to create a post.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (image) formData.append('image', image);

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setText('');
      clearImage();
      onPostCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card create-post">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          maxLength={1000}
        />

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button type="button" className="remove-image" onClick={clearImage}>
              ✕
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <label className="file-label">
            📷 Add Image
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
      </form>
    </section>
  );
};

export default CreatePost;
