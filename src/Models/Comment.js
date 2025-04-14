const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        post_id: {
            type: objectId,
            ref: 'Post',
            required: true,
        },
        user_id: {
            type: objectId,
            ref: 'User',
            required: true,
        },
        comment_content: {
            type: String,
        },
        comment_image: {
            type: String,
        },
        comment_likes: {
            type: [objectId],
            ref: 'User',
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Comment', commentSchema);
