const express = require('express');
const router = express.Router();
const homeController = require('../Controllers/homeController');
const authenticateToken = require('../Middleware/auth');

// Route cho trang Home
router.get('/', authenticateToken, homeController.renderHome);
router.get('/home/following', authenticateToken, homeController.filterFollowing);
router.get('/home/liked', authenticateToken, homeController.filterLiked);

module.exports = router;
