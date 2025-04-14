const mongoose = require('mongoose');

// Khung xương chứa thuộc tính người dùng
const userScheme = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 30,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,

            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,

            maxlength: 50,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profile: {
            display_name: {
                type: String,
                required: true, // Cần phải có tên hiển thị
                default: function () {
                    return this.fullname; // Tên hiển thị mặc định là họ và tên
                },
            },
            avt: {
                type: String,
                default: 'https://res.cloudinary.com/djyugezvf/image/upload/v1733484686/phy000007/q57ps7ajaeqeuqztwkhf.png', // Ảnh đại diện mặc định
            },
            bio: {
                type: String,
                default: null, // Tiểu sử mặc định là null
            },
            nick_name: {
                type: String,
                default: function () {
                    return this.username; // Sử dụng username làm nick name ban đầu
                },
            },
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the 'User' model
                default: [],
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the 'User' model
                default: [],
            },
        ],
        is_verified: {
            type: Boolean,
            default: false, // Ban đầu chưa xác thực
        },
        verification_sent_at: {
            type: Date,
            default: null,
        },
    },
    // cho biết tạo acc lúc nào
    { timestamps: true },
);

module.exports = mongoose.model('User', userScheme);
