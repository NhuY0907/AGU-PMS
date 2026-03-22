// Service for KHOA table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM KHOA');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM KHOA WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('TEN_KHOA', sql.NVarChar(100), data.TEN_KHOA)
      .query('INSERT INTO KHOA (TEN_KHOA) OUTPUT INSERTED.* VALUES (@TEN_KHOA)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_KHOA', sql.NVarChar(100), data.TEN_KHOA)
      .query('UPDATE KHOA SET TEN_KHOA = @TEN_KHOA WHERE ID = @id');
    return result.recordset[0];
}

exports.delete = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM KHOA WHERE ID = @id');
    return result.rowsAffected[0];
}
