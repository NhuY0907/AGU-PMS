// Service for CAI_DAT table
const sql = require('mssql');
const config = require('../config/db');

exports.update = async (id, data) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
      .input('id', sql.Int, id)
      .input('MAU_CHU_DAO', sql.VarChar(7), data.MAU_CHU_DAO)
      .input('CHE_DO_TOI', sql.Bit, data.CHE_DO_TOI)
      .input('NGON_NGU', sql.NVarChar(20), data.NGON_NGU)
      .input('ANH_DAI_DIEN_BASE64', sql.NVarChar(sql.MAX), data.ANH_DAI_DIEN_BASE64)
      .input('NHAN_THONG_BAO_EMAIL', sql.Bit, data.NHAN_THONG_BAO_EMAIL)
      .input('THO_GIAN_NHAC_TRUOC', sql.Int, data.THO_GIAN_NHAC_TRUOC)
      .input('TOKEN_PHIEN_LAM_VIEC', sql.VarChar(255), data.TOKEN_PHIEN_LAM_VIEC)
      .query('UPDATE CAI_DAT SET MAU_CHU_DAO = @MAU_CHU_DAO, CHE_DO_TOI = @CHE_DO_TOI, NGON_NGU = @NGON_NGU, ANH_DAI_DIEN_BASE64 = @ANH_DAI_DIEN_BASE64, NHAN_THONG_BAO_EMAIL = @NHAN_THONG_BAO_EMAIL, THO_GIAN_NHAC_TRUOC = @THO_GIAN_NHAC_TRUOC, TOKEN_PHIEN_LAM_VIEC = @TOKEN_PHIEN_LAM_VIEC WHERE ID_NGUOI_DUNG = @id');
    return result.rowsAffected[0];
}
