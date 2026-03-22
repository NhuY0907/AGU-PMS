// Service for CHUC_VU table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHUC_VU');
    return result.recordset;
}

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM CHUC_VU WHERE ID = @id');
    
    return result.recordset[0];
}

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('TEN_CHUC_VU', sql.NVarChar(50), TEN_CHUC_VU)
      .input('TI_LE_GIAM', sql.Decimal(3,2), TI_LE_GIAM || 0)
      .query('INSERT INTO CHUC_VU (TEN_CHUC_VU, TI_LE_GIAM) OUTPUT INSERTED.* VALUES (@TEN_CHUC_VU, @TI_LE_GIAM)');
    result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .input('TEN_CHUC_VU', sql.NVarChar(50), data.TEN_CHUC_VU)
    .input('TI_LE_GIAM', sql.Decimal(3,2), data.TI_LE_GIAM)
    .query('UPDATE CHUC_VU SET TEN_CHUC_VU = @TEN_CHUC_VU, TI_LE_GIAM = @TI_LE_GIAM WHERE ID = @id');
  
  return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHUC_VU WHERE ID = @id');
  return result.rowsAffected[0];
}