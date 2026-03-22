// Service for CHI_TIET_NCKH table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHI_TIET_NCKH');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHI_TIET_NCKH WHERE ID_NHIEM_VU = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('TEN_SAN_PHAM', sql.NVarChar(500), data.TEN_SAN_PHAM)
      .input('CAP_QUAN_LY', sql.NVarChar(100), data.CAP_QUAN_LY)
      .input('VAI_TRO', sql.NVarChar(100), data.VAI_TRO)
      .input('NGAY_BAT_DAU', sql.Date, data.NGAY_BAT_DAU)
      .input('NGAY_HOAN_THANH', sql.Date, data.NGAY_HOAN_THANH)
      .query('INSERT INTO CHI_TIET_NCKH (ID_NHIEM_VU, TEN_SAN_PHAM, CAP_QUAN_LY, VAI_TRO, NGAY_BAT_DAU, NGAY_HOAN_THANH) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @TEN_SAN_PHAM, @CAP_QUAN_LY, @VAI_TRO, @NGAY_BAT_DAU, @NGAY_HOAN_THANH)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_SAN_PHAM', sql.NVarChar(500), data.TEN_SAN_PHAM)
      .input('CAP_QUAN_LY', sql.NVarChar(100), data.CAP_QUAN_LY)
      .input('VAI_TRO', sql.NVarChar(100), data.VAI_TRO)
      .input('NGAY_BAT_DAU', sql.Date, data.NGAY_BAT_DAU)
      .input('NGAY_HOAN_THANH', sql.Date, data.NGAY_HOAN_THANH)
      .query('UPDATE CHI_TIET_NCKH SET TEN_SAN_PHAM = @TEN_SAN_PHAM, CAP_QUAN_LY = @CAP_QUAN_LY, VAI_TRO = @VAI_TRO, NGAY_BAT_DAU = @NGAY_BAT_DAU, NGAY_HOAN_THANH = @NGAY_HOAN_THANH WHERE ID_NHIEM_VU = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHI_TIET_NCKH WHERE ID_NHIEM_VU = @id');
  return result.rowsAffected[0];
}
