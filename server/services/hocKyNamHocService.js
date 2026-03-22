// Service for HOC_KY_NAM_HOC table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM HOC_KY_NAM_HOC');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM HOC_KY_NAM_HOC WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('TEN_HOC_KY', sql.NVarChar(50), data.TEN_HOC_KY)
      .input('NAM_HOC', sql.VarChar(20), data.NAM_HOC)
      .query('INSERT INTO HOC_KY_NAM_HOC (TEN_HOC_KY, NAM_HOC) OUTPUT INSERTED.* VALUES (@TEN_HOC_KY, @NAM_HOC)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_HOC_KY', sql.NVarChar(50), data.TEN_HOC_KY)
      .input('NAM_HOC', sql.VarChar(20), data.NAM_HOC)
      .query('UPDATE HOC_KY_NAM_HOC SET TEN_HOC_KY = @TEN_HOC_KY, NAM_HOC = @NAM_HOC WHERE ID = @id');
    return result.recordset[0];
}

exports.delete = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM HOC_KY_NAM_HOC WHERE ID = @id');
    return result.rowsAffected[0];
}
