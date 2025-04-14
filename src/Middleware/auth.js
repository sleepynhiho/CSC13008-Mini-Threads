const User = require('../Models/User');
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            req.userId = null;
            req.user = null;
            return next();
        }

        // Xác minh token
        const decoded = await jwt.verify(token, process.env.JWT_REFRESH_KEY);
        req.userId = decoded.id;

        // Tìm người dùng từ cơ sở dữ liệu
        const user = await User.findById(req.userId).select('-password -is_verified -verification_sent_at -createdAt -updatedAt');
        if (!user) {
            return res.sendStatus(404); // Not Found nếu người dùng không tồn tại
        }

        // Gắn thông tin người dùng (nếu cần)
        req.user = user;
        // Tiếp tục
        next();
    } catch (err) {
        console.error('Error in authenticateToken middleware:', err);
        return res.sendStatus(403); // Forbidden nếu có lỗi trong xử lý token
    }
};

module.exports = authenticateToken;
