// Service for GIANG_VIEN table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM GIANG_VIEN');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM GIANG_VIEN WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);

    let result = await pool.request()
        .input('MA_GIANG_VIEN', sql.VarChar(20), data.MA_GIANG_VIEN)
        .input('HO_TEN', sql.NVarChar(100), data.HO_TEN)
        .input('GIOI_TINH', sql.NVarChar(5), data.GIOI_TINH)
        .input('EMAIL', sql.NVarChar(100), data.EMAIL)
        .input('DIEN_THOAI', sql.VarChar(10), data.DIEN_THOAI)
        .input('DINH_MUC_GIO_GOC', sql.Int, data.DINH_MUC_GIO_GOC || 270)
        .input('ID_KHOA', sql.Int, data.ID_KHOA)
        .input('ID_BO_MON', sql.Int, data.ID_BO_MON)
        .input('ID_CHUC_DANH', sql.Int, data.ID_CHUC_DANH)
        .input('ID_NGUOI_DUNG', sql.Int, data.ID_NGUOI_DUNG)
        .query(`
            INSERT INTO GIANG_VIEN (MA_GIANG_VIEN, HO_TEN, GIOI_TINH, EMAIL, DIEN_THOAI, DINH_MUC_GIO_GOC, ID_KHOA, ID_BO_MON, ID_CHUC_DANH, ID_NGUOI_DUNG)
            OUTPUT INSERTED.*
            VALUES (@MA_GIANG_VIEN, @HO_TEN, @GIOI_TINH, @EMAIL, @DIEN_THOAI, @DINH_MUC_GIO_GOC, @ID_KHOA, @ID_BO_MON, @ID_CHUC_DANH, @ID_NGUOI_DUNG)
        `);

    return result.recordset[0];
};

exports.update = async (id, data) => {
    let pool = await sql.connect(config);

    let result = await pool.request()
        .input('id', sql.Int, id)
        .input('HO_TEN', sql.NVarChar(100), data.HO_TEN)
        .input('GIOI_TINH', sql.NVarChar(5), data.GIOI_TINH)
        .input('EMAIL', sql.NVarChar(100), data.EMAIL)
        .input('DIEN_THOAI', sql.VarChar(10), data.DIEN_THOAI)
        .input('DINH_MUC_GIO_GOC', sql.Int, data.DINH_MUC_GIO_GOC)
        .input('ID_KHOA', sql.Int, data.ID_KHOA)
        .input('ID_BO_MON', sql.Int, data.ID_BO_MON)
        .input('ID_CHUC_DANH', sql.Int, data.ID_CHUC_DANH)
        .input('ID_NGUOI_DUNG', sql.Int, data.ID_NGUOI_DUNG)
        .query(`
            UPDATE GIANG_VIEN SET MA_GIANG_VIEN = @MA_GIANG_VIEN, HO_TEN = @HO_TEN, GIOI_TINH = @GIOI_TINH, EMAIL = @EMAIL, DIEN_THOAI = @DIEN_THOAI, DINH_MUC_GIO_GOC = @DINH_MUC_GIO_GOC, ID_KHOA = @ID_KHOA, ID_BO_MON = @ID_BO_MON, ID_CHUC_DANH = @ID_CHUC_DANH, ID_NGUOI_DUNG = @ID_NGUOI_DUNG
            WHERE ID = @id
        `);

    return result.rowsAffected[0];
};

exports.delete = async (id) => {
    let pool = await sql.connect(config);

    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM GIANG_VIEN WHERE ID = @id');

    return result.rowsAffected[0];
};