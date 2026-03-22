// Service for CHI_TIET_HOC_TAP table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHI_TIET_HOC_TAP');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHI_TIET_HOC_TAP WHERE ID_NHIEM_VU = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('TEN_KHOA', sql.NVarChar(255), data.TEN_KHOA)
      .input('CO_SO_DAO_TAO', sql.NVarChar(255), data.CO_SO_DAO_TAO)
      .input('CHUNG_CHI', sql.NVarChar(100), data.CHUNG_CHI)
      .input('MUC_TIEU', sql.NVarChar(sql.MAX), data.MUC_TIEU)
      .input('NGAY_BAT_DAU', sql.Date, data.NGAY_BAT_DAU)
      .input('NGAY_KET_THUC', sql.Date, data.NGAY_KET_THUC)
      .query('INSERT INTO CHI_TIET_HOC_TAP (ID_NHIEM_VU, TEN_KHOA, CO_SO_DAO_TAO, CHUNG_CHI, MUC_TIEU, NGAY_BAT_DAU, NGAY_KET_THUC) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @TEN_KHOA, @CO_SO_DAO_TAO, @CHUNG_CHI, @MUC_TIEU, @NGAY_BAT_DAU, @NGAY_KET_THUC)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('TEN_KHOA', sql.NVarChar(255), data.TEN_KHOA)
      .input('CO_SO_DAO_TAO', sql.NVarChar(255), data.CO_SO_DAO_TAO)
      .input('CHUNG_CHI', sql.NVarChar(100), data.CHUNG_CHI)
      .input('MUC_TIEU', sql.NVarChar(sql.MAX), data.MUC_TIEU)
      .input('NGAY_BAT_DAU', sql.Date, data.NGAY_BAT_DAU)
      .input('NGAY_KET_THUC', sql.Date, data.NGAY_KET_THUC)
      .query('UPDATE CHI_TIET_HOC_TAP SET TEN_KHOA = @TEN_KHOA, CO_SO_DAO_TAO = @CO_SO_DAO_TAO, CHUNG_CHI = @CHUNG_CHI, MUC_TIEU = @MUC_TIEU, NGAY_BAT_DAU = @NGAY_BAT_DAU, NGAY_KET_THUC = @NGAY_KET_THUC WHERE ID_NHIEM_VU = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHI_TIET_HOC_TAP WHERE ID_NHIEM_VU = @id');
  return result.rowsAffected[0];
}
