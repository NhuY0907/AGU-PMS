// Service for THONG_BAO table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM THONG_BAO');
    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM THONG_BAO WHERE ID = @id');

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('ID_NHIEM_VU', sql.Int, data.ID_NHIEM_VU)
      .input('ID_NGUOI_DUNG', sql.Int, data.ID_NGUOI_DUNG)
      .input('NOI_DUNG', sql.NVarChar(500), data.NOI_DUNG)
      .input('NGAY_GUI', sql.DateTime2, data.NGAY_GUI)
      .input('DA_XEM', sql.Bit, data.DA_XEM)
      .query('INSERT INTO THONG_BAO (ID_NHIEM_VU, ID_NGUOI_DUNG, NOI_DUNG, NGAY_GUI, DA_XEM) OUTPUT INSERTED.* VALUES (@ID_NHIEM_VU, @ID_NGUOI_DUNG, @NOI_DUNG, @NGAY_GUI, @DA_XEM)');
    return result.recordset[0];
}

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .input('NOI_DUNG', sql.NVarChar(500), data.NOI_DUNG)
    .input('NGAY_GUI', sql.DateTime2, data.NGAY_GUI)
    .input('DA_XEM', sql.Bit, data.DA_XEM)
    .query('UPDATE THONG_BAO SET NOI_DUNG = @NOI_DUNG, NGAY_GUI = @NGAY_GUI, DA_XEM = @DA_XEM WHERE ID = @id');
  return result.recordset[0];
}

exports.delete = async (id) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM THONG_BAO WHERE ID = @id');
  return result.rowsAffected[0];
}
