const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    // Format: Bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');

        req.user = decoded; // lưu user vào request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
    }
};