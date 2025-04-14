const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        user_id: {
            type: objectId,
            ref: 'User',
            required: true,
        },
        post_quote: {
            type: String,
        },
        post_image: {
            type: String,
        },
        post_likes: {
            type: [objectId],
            ref: 'User',
            default: [],
        },
        post_comments: {
            type: [objectId],
            ref: 'Comment',
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Post', postSchema);
