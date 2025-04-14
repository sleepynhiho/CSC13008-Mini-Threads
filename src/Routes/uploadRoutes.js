const express = require('express');
const router = express.Router();
const upload = require('../Middleware/multer');
const { uploadAvatar, uploadPostImage, uploadCommentImage } = require('../Config/cloudinary');
const User = require('../Models/User');
const authenticateToken = require('../Middleware/auth');
router.post('/test-upload', upload.single('image'), authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log(req.file);
        const uploadedImage = await uploadAvatar(req, res);
        console.log(uploadedImage.secure_url);
        const user = await User.findById(req.userId);
        user.profile.avt = uploadedImage.secure_url;
        user.save();
        // res.redirect('/profile');
        // console.log({
        //         message: 'File uploaded successfully',
        //         url: uploadedImage.secure_url,
        //     });
        return res.json({
            message: 'File uploaded successfully',
            url: uploadedImage.secure_url,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
module.exports = router;
