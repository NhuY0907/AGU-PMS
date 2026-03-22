// Service for CHI_TIET_PHUC_VU_CONG_DONG table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHI_TIET_PHUC_VU_CONG_DONG');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHI_TIET_PHUC_VU_CONG_DONG WHERE ID_NHIEM_VU = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('TEN_HOAT_DONG', sql.NVarChar(255), data.TEN_HOAT_DONG)
      .input('DON_VI_PHOI_HOP', sql.NVarChar(255), data.DON_VI_PHOI_HOP)
      .input('VAI_TRO', sql.NVarChar(100), data.VAI_TRO)
      .input('THOI_GIAN_HOAT_DONG', sql.Date, data.THOI_GIAN_HOAT_DONG)
      .query('INSERT INTO CHI_TIET_PHUC_VU_CONG_DONG (ID_NHIEM_VU, TEN_HOAT_DONG, DON_VI_PHOI_HOP, VAI_TRO, THOI_GIAN_HOAT_DONG) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @TEN_HOAT_DONG, @DON_VI_PHOI_HOP, @VAI_TRO, @THOI_GIAN_HOAT_DONG)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_HOAT_DONG', sql.NVarChar(255), data.TEN_HOAT_DONG)
      .input('DON_VI_PHOI_HOP', sql.NVarChar(255), data.DON_VI_PHOI_HOP)
      .input('VAI_TRO', sql.NVarChar(100), data.VAI_TRO)
      .input('THOI_GIAN_HOAT_DONG', sql.Date, data.THOI_GIAN_HOAT_DONG)
      .query('UPDATE CHI_TIET_PHUC_VU_CONG_DONG SET TEN_HOAT_DONG = @TEN_HOAT_DONG, DON_VI_PHOI_HOP = @DON_VI_PHOI_HOP, VAI_TRO = @VAI_TRO, THOI_GIAN_HOAT_DONG = @THOI_GIAN_HOAT_DONG WHERE ID_NHIEM_VU = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHI_TIET_PHUC_VU_CONG_DONG WHERE ID_NHIEM_VU = @id');
  return result.rowsAffected[0];
}
