// Service for NGUOI_DUNG table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM NGUOI_DUNG');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM NGUOI_DUNG WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('TEN_DANG_NHAP', sql.VarChar(50), data.TEN_DANG_NHAP)
      .input('MAT_KHAU', sql.VarBinary(256), data.MAT_KHAU)
      .input('EMAIL_XAC_NHAN', sql.Bit, data.EMAIL_XAC_NHAN || 0)
      .input('TRANG_THAI', sql.NVarChar(20), data.TRANG_THAI || 'Hoạt động')
      .input('ID_CHUC_VU', sql.Int, data.ID_CHUC_VU)
      .query('INSERT INTO NGUOI_DUNG (TEN_DANG_NHAP, MAT_KHAU, EMAIL_XAC_NHAN, TRANG_THAI, ID_CHUC_VU) OUTPUT INSERTED.* VALUES (@TEN_DANG_NHAP, @MAT_KHAU, @EMAIL_XAC_NHAN, @TRANG_THAI, @ID_CHUC_VU)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_DANG_NHAP', sql.VarChar(50), data.TEN_DANG_NHAP)
      .input('TRANG_THAI', sql.NVarChar(20), data.TRANG_THAI)
      .input('ID_CHUC_VU', sql.Int, data.ID_CHUC_VU)
      .query('UPDATE NGUOI_DUNG SET TEN_DANG_NHAP = @TEN_DANG_NHAP, TRANG_THAI = @TRANG_THAI, ID_CHUC_VU = @ID_CHUC_VU WHERE ID = @id');
    return result.recordset[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM NGUOI_DUNG WHERE ID = @id');
  return result.rowsAffected[0];
}
