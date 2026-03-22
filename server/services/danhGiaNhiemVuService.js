// Service for DANH_GIA_NHIEM_VU table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM DANH_GIA_NHIEM_VU');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM DANH_GIA_NHIEM_VU WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('DANH_GIA', sql.NVarChar(sql.MAX), data.DANH_GIA)
      .input('HE_SO_HOAN_THANH', sql.Float, data.HE_SO_HOAN_THANH)
      .query('INSERT INTO DANH_GIA_NHIEM_VU (ID_NHIEM_VU, DANH_GIA, HE_SO_HOAN_THANH) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @DANH_GIA, @HE_SO_HOAN_THANH)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .input('DANH_GIA', sql.NVarChar(sql.MAX), data.DANH_GIA)
    .input('HE_SO_HOAN_THANH', sql.Float, data.HE_SO_HOAN_THANH)
    .query('UPDATE DANH_GIA_NHIEM_VU SET DANH_GIA = @DANH_GIA, HE_SO_HOAN_THANH = @HE_SO_HOAN_THANH WHERE ID = @id');
  return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM DANH_GIA_NHIEM_VU WHERE ID = @id');
  return result.rowsAffected[0];
}
