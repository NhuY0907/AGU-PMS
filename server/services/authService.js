const { poolPromise, sql } = require('../config/db');

// Đăng nhập
exports.login = async (username, password) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .execute('sp_DangNhap');

        return result.recordset[0] || null;

    } catch (err) {
        throw new Error('Lỗi login: ' + err.message);
    }
};

// Đăng ký
exports.register = async (data) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('username', sql.VarChar, data.username)
            .input('password', sql.VarChar, data.password)
            .input('ho_ten', sql.NVarChar, data.hoTen)
            .input('email', sql.VarChar, data.email)
            .input('ma_gv', sql.VarChar, data.maGV)
            .input('gioi_tinh', sql.NVarChar, data.gioiTinh)
            .execute('sp_DangKyTaiKhoan');

        return result.recordset[0];

    } catch (err) {
        throw new Error('Lỗi register: ' + err.message);
    }
};