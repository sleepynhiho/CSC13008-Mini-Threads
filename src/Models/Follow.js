const mongoose = require('mongoose');

const followScheme = new mongoose.Schema(
    {
        // người được follow
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // người theo dõi
        followerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Follow', followScheme);
