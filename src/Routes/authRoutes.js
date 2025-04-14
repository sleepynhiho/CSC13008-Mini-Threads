const express = require('express');
const router = express.Router();
const {
    loginController,
    signupController,
    requestRefreshToken,
    logoutController,
    resetPassword,
    changePassword,
    updatePassword,
    verifyController,
} = require('../Controllers/authController');

//const middlewareController = require("../Controllers/middlewareController");
// Route đăng nhập
router.post('/login', loginController);

// Route đăng ký
router.post('/signup', signupController);

// REFRESH
router.post('/refresh', requestRefreshToken);

// ROUTE LOGOUT
router.post('/logout', logoutController);
router.get('/login', (req, res) => {
    res.render('Auth/login', { layout: false });
});
router.get('/signup', (req, res) => {
    res.render('Auth/signup', { layout: false });
});

// Resest password
router.get('/forgotPassword', (req, res) => {
    res.render('Auth/forgotPassword', { layout: false });
});

router.post('/forgotPassword', resetPassword);

router.get('/changePassword', (req, res) => {
    res.render('Auth/changePassword', { layout: false });
});

router.post('/changePassword', updatePassword);

router.get('/verify', verifyController);

// lấy access token mới
router.post('/newAccessToken', requestRefreshToken);
module.exports = router;
