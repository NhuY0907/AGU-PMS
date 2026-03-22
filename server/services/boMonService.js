// Service for BO_MON table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM BO_MON');
    return result.recordset;
}

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM BO_MON WHERE ID = @id');
    
      return result.recordset[0];
}

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('TEN_BO_MON', sql.NVarChar(100), data.TEN_BO_MON)
      .input('ID_KHOA', sql.Int, data.ID_KHOA)
      .query('INSERT INTO BO_MON (TEN_BO_MON, ID_KHOA) OUTPUT INSERTED.* VALUES (@TEN_BO_MON, @ID_KHOA)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_BO_MON', sql.NVarChar(100), data.TEN_BO_MON)
      .input('ID_KHOA', sql.Int, data.ID_KHOA)
      .query('UPDATE BO_MON SET TEN_BO_MON = @TEN_BO_MON, ID_KHOA = @ID_KHOA WHERE ID = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
      .query('DELETE FROM BO_MON WHERE ID = @id');
    return result.rowsAffected[0];
}
