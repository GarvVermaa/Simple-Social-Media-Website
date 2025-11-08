import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router =express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email')
      .sort({ createAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error Fetching Posts' });
  }

});

router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({
      content,
      author: req.userId,
      likes: [],
    });
    const populatePost = await Post.findById(post._id).populate('author', 'name email');
    res.status(201).json(populatePost);
  } catch (err) {
    res.status(500).json({ message: 'Error Creating the post' });
  }

});

//Bonus-Edit

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post Not Found ' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    post.content = content;
    await post.save();
    const updatePost = await Post.findById(id).populate('author', 'name email');
    res.status(200).json(updatePost);

  }
  catch (error) {
    res.status(500).json({ message: 'Errror Updating the Post  ' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not Found! ' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized!' });
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post Deleted ' });
  } catch (err) {
    res.status(500).json({ message: 'Error Deleting the Post ' });
  }

});


router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post Not Found ' });
    }
    const likeIndex = post.likes.indexOf(req.userId);
    if (likeIndex == -1) {
      post.liles.push(req.userId);
    } else {
      post.likes.splice(likeIndex, -1);
    }
    await post.save();
    const updatePost = await Post.findById(id)
      .populate('author', 'name email');
    res.status(200).json(updatePost);

  }
  catch (err) {
    res.status(500).json({ message: 'Error Liking ' });
  }
});

export default router;
