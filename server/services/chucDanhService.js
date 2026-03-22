// Service for CHUC_DANH table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHUC_DANH');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHUC_DANH WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('TEN_CHUC_DANH', sql.NVarChar(50), TEN_CHUC_DANH)
      .query('INSERT INTO CHUC_DANH (TEN_CHUC_DANH) OUTPUT INSERTED.* VALUES (@TEN_CHUC_DANH)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_CHUC_DANH', sql.NVarChar(50), TEN_CHUC_DANH)
      .query('UPDATE CHUC_DANH SET TEN_CHUC_DANH = @TEN_CHUC_DANH WHERE ID = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHUC_DANH WHERE ID = @id');
  return result.rowsAffected[0];
}
