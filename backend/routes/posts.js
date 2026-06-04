const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/posts — paginated public feed
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 5));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch posts.' });
  }
});

// POST /api/posts — create text and/or image post
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const text = (req.body.text || '').trim();
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must contain text, an image, or both.' });
    }

    const post = await Post.create({
      author: { username: req.user.username, userId: req.user._id },
      text,
      imageUrl,
      likes: [],
      comments: [],
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create post.' });
  }
});

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const existingIndex = post.likes.findIndex(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (existingIndex > -1) {
      post.likes.splice(existingIndex, 1);
    } else {
      post.likes.push({ username: req.user.username, userId: req.user._id });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update like.' });
  }
});

// POST /api/posts/:id/comments — add comment
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.comments.push({
      username: req.user.username,
      userId: req.user._id,
      text: text.trim(),
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to add comment.' });
  }
});

module.exports = router;
