const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'sa123',
    server: '.\\SQLEXPRESS',
    database: 'AGU_PMS',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Kết nối SQL thành công');
        return pool;
    })
    .catch(err => console.error('❌ Lỗi kết nối SQL:', err));

module.exports = {
    sql,
    poolPromise
};