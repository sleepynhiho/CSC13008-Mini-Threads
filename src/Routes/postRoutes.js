const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');
const authenticateToken = require('../Middleware/auth');
const upload = require('../Middleware/multer');

// Route to get all posts (Home page or main feed)
router.get('/:id', authenticateToken, postController.renderpost);

// Route to create a new post
router.post('/newpost', upload.single('post_image'), authenticateToken, postController.createPost);
router.post('/newcomment', authenticateToken, upload.single('post_image'), postController.createComment);
router.post('/like-post/:id', authenticateToken, postController.likePost);
router.post('/like-comment/:id', authenticateToken, postController.likeComment);
router.delete('/delete-post/:id', authenticateToken, postController.deletePost);
router.delete('/delete-comment/:id', authenticateToken, postController.deleteComment);
module.exports = router;
