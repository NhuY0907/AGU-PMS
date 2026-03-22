const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password' // dùng app password
    }
});

exports.sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: '"AGU PMS" <your_email@gmail.com>',
        to: email,
        subject: 'Mã xác thực OTP',
        html: `<h3>Mã OTP của bạn là: <b>${otp}</b></h3>`
    });
};