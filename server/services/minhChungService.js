// Service for MINH_CHUNG table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM MiNH_CHUNG');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM MINH_CHUNG WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('TEN_MINH_CHUNG', sql.NVarChar(255), data.TEN_MINH_CHUNG)
      .input('DUONG_DAN_URL', sql.NVarChar(sql.MAX), data.DUONG_DAN_URL)
      .query('INSERT INTO MINH_CHUNG (ID_NHIEM_VU, TEN_MINH_CHUNG, DUONG_DAN_URL) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @TEN_MINH_CHUNG, @DUONG_DAN_URL)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_MINH_CHUNG', sql.NVarChar(255), data.TEN_MINH_CHUNG)
      .input('DUONG_DAN_URL', sql.NVarChar(sql.MAX), data.DUONG_DAN_URL)
      .query('UPDATE MINH_CHUNG SET TEN_MINH_CHUNG = @TEN_MINH_CHUNG, DUONG_DAN_URL = @DUONG_DAN_URL WHERE ID = @id');
    return result.recordset[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM MINH_CHUNG WHERE ID = @id');
  return result.rowsAffected[0];
}
