const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

/*
console.log('auth =', auth);
console.log('getProfile =', ctrl.getProfile);

// test log
console.log('login =', ctrl.login);

// đăng nhập
router.post('/login', ctrl.login);

// đăng ký
router.post('/register', ctrl.register);

// đổi mật khẩu
router.post('/change-password', ctrl.changePassword);

// đăng xuất
router.post('/logout', ctrl.logout);

router.post('/send-otp', ctrl.sendOTP);
router.post('/verify-otp', ctrl.verifyOTP);
*/
router.post('/login', (req, res) => {
    res.json({ message: 'OK LOGIN' });
});

module.exports = router;
