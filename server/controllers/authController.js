const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const user = await authService.login(
            req.body.username,
            req.body.password
        );

        if (!user) {
            return res.status(401).json({
                message: 'Sai tài khoản hoặc mật khẩu'
            });
        }

        const token = jwt.sign(
            { id: user.UserID },
            'SECRET_KEY',
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/*
exports.getProfile = (req, res) => {
    res.json({ message: 'getProfile OK' });
};

exports.register = (req, res) => {
    res.json({ message: 'register OK' });
};

exports.changePassword = (req, res) => {
    res.json({ message: 'changePassword OK' });
};

exports.logout = (req, res) => {
    res.json({ message: 'logout OK' });
};

exports.sendOTP = (req, res) => {
    res.json({ message: 'sendOTP OK' });
};

exports.verifyOTP = (req, res) => {
    res.json({ message: 'verifyOTP OK' });
};
*/