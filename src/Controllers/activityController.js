const Notification = require('../Models/Notification');
let activityController = {};

activityController.renderActivity = async (req, res) => {
    try {
        if (!req.userId) {
            return res.redirect('/auth/login');
        }

        const typeMapping = {
            all: 'all',
            follows: 'follow',
            likes: 'like',
            replies: 'comment',
        };
        const type = req.params.type || 'all';
        const selectedItem = typeMapping[type.toLowerCase()];

        if (!['all', 'follow', 'like', 'comment'].includes(selectedItem)) {
            return res.status(404).render('404', { layout: false });
        }

        const noti = await Notification.find({ user_id: req.userId })
            .populate('action_user_id', 'profile.nick_name profile.avt')
            .populate('post_id', 'post_image post_quote')
            .populate('comment_id', 'comment_content comment_likes comment_image')
            .sort({ createdAt: -1 });

        const unreadCount = noti.filter((notification) => !notification.is_read).length;

        const filteredNoti = selectedItem === 'all' ? noti : noti.filter((notification) => notification.type.toLowerCase() === selectedItem);

        const headerMapping = {
            all: 'Activity',
            follow: 'Follows',
            like: 'Likes',
            comment: 'Replies',
        };

        const header = headerMapping[selectedItem] || 'Activity';
        const title = `${unreadCount > 0 ? `(${unreadCount}) ` : ''}Activity`;

        res.render('Activity/activity', {
            title,
            header,
            refreshItems: [
                { name: 'All', link: '/activity', type: 'all' },
                { name: 'Follows', link: '/activity/follows', type: 'follow' },
                { name: 'Likes', link: '/activity/likes', type: 'like' },
                { name: 'Replies', link: '/activity/replies', type: 'comment' },
            ],
            selectedItem,
            userid: req.user._id,
            username: req.user.profile.nick_name,
            avatarSrc: req.user.profile.avt,
            following: req.user.following,
            notifications: filteredNoti,
            unreadCount,
        });
    } catch (error) {
        console.error('Error in activityController:', error.message, error.stack);
        res.status(500).send('Internal Server Error');
    }
};

activityController.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        // Cập nhật trạng thái is_read thành true
        const updatedNotification = await Notification.findByIdAndUpdate(id, { is_read: true }, { new: true });

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error in markNotificationAsRead:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

activityController.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa thông báo dựa trên ID
        const deletedNotification = await Notification.findByIdAndDelete(id);

        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error in deleteNotification:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = activityController;
