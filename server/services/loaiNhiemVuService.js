// Service for LOAI_NHIEM_VU table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM LOAI_NHIEM_VU');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM LOAI_NHIEM_VU WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('TEN_LOAI', sql.NVarChar(100), data.TEN_LOAI)
      .query('INSERT INTO LOAI_NHIEM_VU (TEN_LOAI) OUTPUT INSERTED.* VALUES (@TEN_LOAI)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_LOAI', sql.NVarChar(100), data.TEN_LOAI)
      .query('UPDATE LOAI_NHIEM_VU SET TEN_LOAI = @TEN_LOAI WHERE ID = @id');
    return result.recordset[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM LOAI_NHIEM_VU WHERE ID = @id');
  return result.rowsAffected[0];
}
