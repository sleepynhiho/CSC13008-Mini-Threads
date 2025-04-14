const path = require('path');
const User = require('../Models/User'); // model user
const Follow = require('../Models/Follow'); // model follow
const jwt = require('jsonwebtoken'); // token
const { default: mongoose } = require('mongoose');
const env = require('dotenv').config(); // biến môi trường
const Post = require('../Models/Post');
const Notification = require('../Models/Notification');
const { uploadAvatar } = require('../Config/cloudinary');

// Initialize GridFS
// let gfs;
// const conn = mongoose.connection;
// conn.once('open', () => {
//     gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//         bucketName: 'uploads',
//     });
// });

const followController = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' }); // Return JSON response for consistency
        }

        const curUserId = req.userId;
        const targetUserId = req.params.id;

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        const currentUser = await User.findById(curUserId);
        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found' });
        }

        const isFollowing = targetUser.followers.some((follower) => follower.equals(curUserId));

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(curUserId, { $pull: { following: targetUserId } });
            await User.findByIdAndUpdate(targetUserId, { $pull: { followers: curUserId } });

            // Xóa thông báo follow
            await Notification.findOneAndDelete({
                action_user_id: curUserId,
                user_id: targetUserId,
                type: 'follow',
            });

            return res.status(200).json({ message: 'Unfollowed successfully', action: 'unfollow' });
        } else {
            // Follow
            await User.findByIdAndUpdate(curUserId, { $push: { following: targetUserId } });
            await User.findByIdAndUpdate(targetUserId, { $push: { followers: curUserId } });

            // Tạo thông báo follow
            await Notification.create({
                action_user_id: curUserId,
                user_id: targetUserId,
                type: 'follow',
            });

            return res.status(200).json({ message: 'Followed successfully', action: 'follow' });
        }
    } catch (error) {
        console.error('Error in followController:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getOtherUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).render('404', { layout: false }); // Render 404 page for invalid ID format
        }
        if (userId === req.userId) {
            return res.redirect('/profile');
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).render('404', { layout: false }); // Render 404 page for non-existent user
        }
        // Check if the current user is following this user
        let isFollowing = false;
        const curUser = await User.findById(req.userId);
        if (curUser) {
            isFollowing = user.followers.some((follower) => follower.equals(curUser._id));
        }

        // Populate followers and following user details

        const populatedUser = await User.findById(userId).populate('followers').populate('following');
        const followerUsers = populatedUser.followers;
        const followingUsers = populatedUser.following;

        const post = await Post.find({ user_id: userId })
            .populate('user_id', 'profile.nick_name profile.display_name profile.avt')
            .sort({ createdAt: -1 });

        const unreadCount = req.user ? await Notification.countDocuments({ user_id: req.userId, is_read: false }) : 0;
        const title = `${unreadCount > 0 ? `(${unreadCount}) ` : ''}${user.profile.display_name}`;

        res.render('profile', {
            title: title,
            header: user.profile.nick_name,
            refreshItems: [],
            selectedItem: null,
            user: user,
            username: req.user?.profile.nick_name || 'Guest',
            userid: req.user?._id || null,
            avatarSrc: req.user?.profile.avt || null,
            followerUsers: followerUsers,
            followingUsers: followingUsers,
            type: 'guest',
            isFollowing: isFollowing, // Pass a boolean indicating if the current user is following this user
            curUserId: curUser?._id ? curUser._id : null, // Pass a boolean indicating if the user is authenticated
            posts: post,
            unreadCount: unreadCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const updateProfileController = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).send('Unauthorized');
        }

        // Fetch user data from the database using the userId from the JWT token
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (req.body.nickname) {
            const existingUser = await User.findOne({
                'profile.nick_name': req.body.nickname,
                _id: { $ne: req.userId },
            });

            if (existingUser) {
                return res.status(409).json({ message: 'Nickname already exists' });
            }
        }

        if (req.file) {
            const uploadResult = await uploadAvatar(req.file, req.userId);
            user.profile.avt = uploadResult.secure_url;
        }

        // Update user profile with form data
        user.profile.display_name = req.body.name;
        user.profile.nick_name = req.body.nickname;
        user.profile.bio = req.body.bio;
        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const profileController = async (req, res) => {
    try {
        // Fetch user data from the database using the userId from the JWT token
        if (!req.userId) {
            return res.redirect('/auth/login');
        }
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find all followers for the user
        const populatedUser = await User.findById(userId).populate('followers').populate('following');
        const followerUsers = populatedUser.followers;
        const followingUsers = populatedUser.following;

        const posts = await Post.find({ user_id: userId })
            .populate('user_id', 'profile.nick_name profile.display_name profile.avt')
            .sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            user_id: req.userId,
            is_read: false,
        });
        const title = `${unreadCount > 0 ? `(${unreadCount}) ` : ''}${user.profile.display_name}`;

        res.render('profile', {
            title: title,
            header: 'Personal profile',
            refreshItems: [],
            selectedItem: null,
            user: user,
            username: user.nick_name,
            userid: req.user._id,
            avatarSrc: user.profile.avt,
            followerUsers: followerUsers,
            followingUsers: followingUsers,
            type: 'owner',
            posts: posts,
            curUserId: user._id || null,
            unreadCount: unreadCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// //hàm cũ setup cho gfs
// const uploadAvatar = async (req, res) => {
//     try {
//         const user = await User.findById(req.userId);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         console.log(req.file);
//         // Ensure the file object is defined
//         if (!req.file || !req.file.id) {
//             return res.status(400).send('File  upload failed');
//         }
//         // Find the old avatar file ID
//         const oldAvatarId = user.profile.avt;

//         // Update user's avatar with the file ID
//         console.log('ready to update avatar');
//         user.profile.avt = req.file.id;
//         await user.save();
//         console.log('Avatar updated successfully');

//         // if (oldAvatarId) {
//         //   gfs.delete(new mongoose.Types.ObjectId(oldAvatarId), (err) => {
//         //     if (err) {
//         //       console.error("Failed to delete old avatar:", err);
//         //     } else {
//         //       console.log("Old avatar deleted successfully");
//         //     }
//         //   });
//         // }

//         res.redirect('/profile');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// };

// //hàm cũ setup cho gfs
// const getAvatar = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         if (!user.profile.avt) {
//             return res.status(404).send('No avatar found');
//         }

//         const file = await gfs.find({ _id: new mongoose.Types.ObjectId(user.profile.avt) }).toArray();
//         if (!file || file.length === 0) {
//             return res.status(404).send('No file found');
//         }

//         gfs.openDownloadStream(new mongoose.Types.ObjectId(user.profile.avt)).pipe(res);
//     } catch (error) {
//         console.error('Some thing wrong with avatar', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

module.exports = {
    profileController,
    updateProfileController,
    getOtherUserProfile,
    followController,
};
