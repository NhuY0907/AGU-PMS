// Service for CHI_TIET_HOAT_DONG_KHAC table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHI_TIET_HOAT_DONG_KHAC');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHI_TIET_HOAT_DONG_KHAC WHERE ID_NHIEM_VU = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('NOI_DUNG_CONG_VIEC', sql.NVarChar(500), data.NOI_DUNG_CONG_VIEC)
      .input('GHI_CHU', sql.NVarChar(sql.MAX), data.GHI_CHU)
      .query('INSERT INTO CHI_TIET_HOAT_DONG_KHAC (ID_NHIEM_VU, NOI_DUNG_CONG_VIEC, GHI_CHU) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @NOI_DUNG_CONG_VIEC, @GHI_CHU)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('NOI_DUNG_CONG_VIEC', sql.NVarChar(500), data.NOI_DUNG_CONG_VIEC)
      .input('GHI_CHU', sql.NVarChar(sql.MAX), data.GHI_CHU)
      .query('UPDATE CHI_TIET_HOAT_DONG_KHAC SET NOI_DUNG_CONG_VIEC = @NOI_DUNG_CONG_VIEC, GHI_CHU = @GHI_CHU WHERE ID_NHIEM_VU = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHI_TIET_HOAT_DONG_KHAC WHERE ID_NHIEM_VU = @id');
  return result.rowsAffected[0];
}
