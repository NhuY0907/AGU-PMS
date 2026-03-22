// Service for CHI_TIET_GIANG_DAY table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHI_TIET_GIANG_DAY');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHI_TIET_GIANG_DAY WHERE ID_NHIEM_VU = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('MA_HOC_PHAN', sql.VarChar(20), data.MA_HOC_PHAN)
      .input('SO_TIET_THUC_DAY', sql.Int, data.SO_TIET_THUC_DAY)
      .input('SO_SINH_VIEN', sql.Int, data.SO_SINH_VIEN)
      .input('LOAI_HINH', sql.NVarChar(20), data.LOAI_HINH)
      .input('TRINH_DO', sql.NVarChar(20), data.TRINH_DO)
      .query('INSERT INTO CHI_TIET_GIANG_DAY (ID_NHIEM_VU, MA_HOC_PHAN, SO_TIET_THUC_DAY, SO_SINH_VIEN, LOAI_HINH, TRINH_DO) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @MA_HOC_PHAN, @SO_TIET_THUC_DAY, @SO_SINH_VIEN, @LOAI_HINH, @TRINH_DO)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('MA_HOC_PHAN', sql.VarChar(20), data.MA_HOC_PHAN)
      .input('SO_TIET_THUC_DAY', sql.Int, data.SO_TIET_THUC_DAY)
      .input('SO_SINH_VIEN', sql.Int, data.SO_SINH_VIEN)
      .input('LOAI_HINH', sql.NVarChar(20), data.LOAI_HINH)
      .input('TRINH_DO', sql.NVarChar(20), data.TRINH_DO)
      .query('UPDATE CHI_TIET_GIANG_DAY SET MA_HOC_PHAN = @MA_HOC_PHAN, SO_TIET_THUC_DAY = @SO_TIET_THUC_DAY, SO_SINH_VIEN = @SO_SINH_VIEN, LOAI_HINH = @LOAI_HINH, TRINH_DO = @TRINH_DO WHERE ID_NHIEM_VU = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHI_TIET_GIANG_DAY WHERE ID_NHIEM_VU = @id');
  return result.rowsAffected[0];
}
