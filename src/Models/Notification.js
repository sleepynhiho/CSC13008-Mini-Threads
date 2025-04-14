const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        action_user_id: {
            // người thực hiện hành động
            type: objectId,
            ref: 'User',
            required: true,
        },
        user_id: {
            // người nhận thông báo
            type: objectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String, // follow, like, comment
            required: true,
        },
        post_id: {
            // nếu là like
            type: objectId,
            ref: 'Post',
        },
        comment_id: {
            // nếu là comment
            type: objectId,
            ref: 'Comment',
        },
        is_read: {
            // đã đọc thông báo hay chưa
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Notification', notificationSchema);
