// Service for THEO_DOI_TIEN_DO table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM THEO_DOI_TIEN_DO');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM THEO_DOI_TIEN_DO WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('ID_NGUOI_DUNG', sql.Int, data.ID_NGUOI_DUNG)
      .input('PHAN_TRAM', sql.Int, data.PHAN_TRAM)
      .input('GHI_CHU_TIEN_DO', sql.NVarChar(sql.MAX), data.GHI_CHU_TIEN_DO)
      .query('INSERT INTO THEO_DOI_TIEN_DO (ID_NHIEM_VU, ID_NGUOI_DUNG, PHAN_TRAM, GHI_CHU_TIEN_DO) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @ID_NGUOI_DUNG, @PHAN_TRAM, @GHI_CHU_TIEN_DO)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .input('PHAN_TRAM', sql.Int, data.PHAN_TRAM)
    .input('GHI_CHU_TIEN_DO', sql.NVarChar(sql.MAX), data.GHI_CHU_TIEN_DO)
    .query('UPDATE THEO_DOI_TIEN_DO SET PHAN_TRAM = @PHAN_TRAM, GHI_CHU_TIEN_DO = @GHI_CHU_TIEN_DO WHERE ID = @id');
  return result.recordset[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM THEO_DOI_TIEN_DO WHERE ID = @id');
  return result.rowsAffected[0];
}
