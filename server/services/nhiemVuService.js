// Service for NHIEM_VU table
const sql = require('mssql');
const config = require('../config/db');

exports.getAll = async () => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .query(`SELECT * FROM NHIEM_VU`);

    return result.recordset;
};

exports.getById = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM NHIEM_VU WHERE ID = @id`);

    return result.recordset[0];
};

exports.create = async (data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('TEN_NHIEM_VU', sql.NVarChar(255), data.TEN_NHIEM_VU)
        .input('MO_TA', sql.NVarChar(sql.MAX), data.MO_TA)
        .input('TRANG_THAI', sql.NVarChar(50), data.TRANG_THAI || 'Chưa thực hiện')
        .input('GIO_QUY_DOI', sql.Decimal(10,2), data.GIO_QUY_DOI || 0)
        .input('HAN_CHOT', sql.DateTime, data.HAN_CHOT)
        .input('ID_GV', sql.Int, data.ID_GV)
        .input('ID_HOC_KY', sql.Int, data.ID_HOC_KY)
        .input('ID_LOAI_NHIEM_VU', sql.Int, data.ID_LOAI_NHIEM_VU)
        .query(`
            INSERT INTO NHIEM_VU (TEN_NHIEM_VU, MO_TA, TRANG_THAI, GIO_QUY_DOI, HAN_CHOT, ID_GV, ID_HOC_KY, ID_LOAI_NHIEM_VU)
            OUTPUT INSERTED.*
            VALUES (@TEN_NHIEM_VU, @MO_TA, @TRANG_THAI, @GIO_QUY_DOI, @HAN_CHOT, @ID_GV, @ID_HOC_KY, @ID_LOAI_NHIEM_VU)
        `);

    return result.recordset[0];
};

exports.update = async (id, data) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .input('TEN_NHIEM_VU', sql.NVarChar(255), data.TEN_NHIEM_VU)
        .input('MO_TA', sql.NVarChar(sql.MAX), data.MO_TA)
        .input('TRANG_THAI', sql.NVarChar(50), data.TRANG_THAI)
        .input('GIO_QUY_DOI', sql.Decimal(10,2), data.GIO_QUY_DOI)
        .input('HAN_CHOT', sql.DateTime, data.HAN_CHOT)
        .input('ID_GV', sql.Int, data.ID_GV)
        .input('ID_HOC_KY', sql.Int, data.ID_HOC_KY)
        .input('ID_LOAI_NHIEM_VU', sql.Int, data.ID_LOAI_NHIEM_VU)
        .query(`
            UPDATE NHIEM_VU
            SET TEN_NHIEM_VU = @TEN_NHIEM_VU, MO_TA = @MO_TA, TRANG_THAI = @TRANG_THAI, GIO_QUY_DOI = @GIO_QUY_DOI, HAN_CHOT = @HAN_CHOT, ID_GV = @ID_GV, ID_HOC_KY = @ID_HOC_KY, ID_LOAI_NHIEM_VU = @ID_LOAI_NHIEM_VU, NGAY_CAP_NHAT = SYSDATETIME()
            WHERE ID = @id
        `);

    return result.rowsAffected[0];
};

exports.delete = async (id) => {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM NHIEM_VU WHERE ID = @id`);

    return result.rowsAffected[0];
};