const express = require('express');
const router = express.Router();
const activityController = require('../Controllers/activityController');
const authenticateToken = require('../Middleware/auth');

// Route cho trang Activity
router.get('/', authenticateToken, activityController.renderActivity);
router.get('/:type', authenticateToken, activityController.renderActivity);
router.put('/mark-as-read/:id', authenticateToken, activityController.markNotificationAsRead);
router.delete('/delete/:id', authenticateToken, activityController.deleteNotification);

module.exports = router;
