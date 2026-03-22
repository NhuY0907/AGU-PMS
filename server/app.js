const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

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

// connect 1 lần
sql.connect(config)
    .then(() => console.log('Kết nối SQL Server thành công'))
    .catch(err => console.log('Lỗi:', err));

// LOGIN
/*
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await sql.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarBinary, Buffer.from(password))
            .execute('sp_DangNhap');

        res.json(result.recordset[0] || { success: false });

    } catch (err) {
        res.status(500).send(err.message);
    }
});
*/
// routes chính
app.use('/api', require('./routes'));

app.listen(3000, () => {
    console.log('http://localhost:3000');
});