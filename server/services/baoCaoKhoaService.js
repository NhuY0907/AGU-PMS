// Service for BAO_CAO_KHOA table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM BAO_CAO_KHOA');
    return result.recordset;
}

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM BAO_CAO_KHOA WHERE ID = @id');
    
      return result.recordset[0];
}

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('ID_GV', sql.Int, data.ID_GV)
      .input('ID_HOC_KY', sql.Int, data.ID_HOC_KY)
      .input('TEN_BAO_CAO', sql.NVarChar(255), data.TEN_BAO_CAO)
      .input('LOAI_BAO_CAO', sql.NVarChar(100), data.LOAI_BAO_CAO)
      .input('DUONG_DAN_FILE', sql.NVarChar(sql.MAX), data.DUONG_DAN_FILE)
      .input('TRANG_THAI', sql.NVarChar(50), data.TRANG_THAI)
      .query('INSERT INTO BAO_CAO_KHOA (ID_GV, ID_HOC_KY, TEN_BAO_CAO, LOAI_BAO_CAO, DUONG_DAN_FILE, TRANG_THAI) OUTPUT INSERTED.* VALUES (@ID_GV, @ID_HOC_KY, @TEN_BAO_CAO, @LOAI_BAO_CAO, @DUONG_DAN_FILE, @TRANG_THAI)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_BAO_CAO', sql.NVarChar(255), data.TEN_BAO_CAO)
      .input('LOAI_BAO_CAO', sql.NVarChar(100), data.LOAI_BAO_CAO)
      .input('DUONG_DAN_FILE', sql.NVarChar(sql.MAX), data.DUONG_DAN_FILE)
      .input('TRANG_THAI', sql.NVarChar(50), data.TRANG_THAI)
      .query('UPDATE BAO_CAO_KHOA SET TEN_BAO_CAO = @TEN_BAO_CAO, LOAI_BAO_CAO = @LOAI_BAO_CAO, DUONG_DAN_FILE = @DUONG_DAN_FILE, TRANG_THAI = @TRANG_THAI WHERE ID = @id');
    return result.rowsAffected[0];
}

exports.deleteBaoCaoKhoa = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM BAO_CAO_KHOA WHERE ID = @id');
  return result.rowsAffected[0];
}