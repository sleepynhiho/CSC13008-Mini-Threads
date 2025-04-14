const express = require('express');
const router = express.Router();
const searchController = require('../Controllers/searchController');
const { followController } = require('../Controllers/profileController');
const authenticateToken = require('../Middleware/auth');

router.get('/', authenticateToken, searchController);

router.post('/follow/:id', authenticateToken, followController);

module.exports = router;
