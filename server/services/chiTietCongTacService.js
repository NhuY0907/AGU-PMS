// Service for CHI_TIET_CONG_TAC table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM CHI_TIET_CONG_TAC');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM CHI_TIET_CONG_TAC WHERE ID_NHIEM_VU = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('DIA_DIEM', sql.NVarChar(255), data.DIA_DIEM)
      .input('MUC_DICH', sql.NVarChar(500), data.MUC_DICH)
      .input('QUYET_DINH_SO', sql.VarChar(50), data.QUYET_DINH_SO)
      .input('PHUONG_TIEN', sql.NVarChar(100), data.PHUONG_TIEN)
      .input('NGAY_BAT_DAU', sql.Date, data.NGAY_BAT_DAU)
      .input('NGAY_KET_THUC', sql.Date, data.NGAY_KET_THUC)
      .input('TONG_KINH_PHI', sql.Decimal(18,2), data.TONG_KINH_PHI)
      .query('INSERT INTO CHI_TIET_CONG_TAC (ID_NHIEM_VU, DIA_DIEM, MUC_DICH, QUYET_DINH_SO, PHUONG_TIEN, NGAY_BAT_DAU, NGAY_KET_THUC, TONG_KINH_PHI) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @DIA_DIEM, @MUC_DICH, @QUYET_DINH_SO, @PHUONG_TIEN, @NGAY_BAT_DAU, @NGAY_KET_THUC, @TONG_KINH_PHI)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('DIA_DIEM', sql.NVarChar(255), data.DIA_DIEM)
      .input('MUC_DICH', sql.NVarChar(500), data.MUC_DICH)
      .input('QUYET_DINH_SO', sql.VarChar(50), data.QUYET_DINH_SO)
      .input('PHUONG_TIEN', sql.NVarChar(100), data.PHUONG_TIEN)
      .input('NGAY_BAT_DAU', sql.Date, data.NGAY_BAT_DAU)
      .input('NGAY_KET_THUC', sql.Date, data.NGAY_KET_THUC)
      .input('TONG_KINH_PHI', sql.Decimal(18,2), data.TONG_KINH_PHI)
      .query('UPDATE CHI_TIET_CONG_TAC SET DIA_DIEM = @DIA_DIEM, MUC_DICH = @MUC_DICH, QUYET_DINH_SO = @QUYET_DINH_SO, PHUONG_TIEN = @PHUONG_TIEN, NGAY_BAT_DAU = @NGAY_BAT_DAU, NGAY_KET_THUC = @NGAY_KET_THUC, TONG_KINH_PHI = @TONG_KINH_PHI WHERE ID_NHIEM_VU = @id');
    return result.rowsAffected[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CHI_TIET_CONG_TAC WHERE ID_NHIEM_VU = @id');
  return result.rowsAffected[0];
}
