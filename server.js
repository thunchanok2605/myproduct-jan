var express = require('express');
var cors = require('cors');
const mysql = require('mysql2');

// ✅ ใช้ createPool() แทน createConnection()
const Connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',  // ตรวจสอบว่ามีรหัสผ่านไหม
    database: 'product-jan',
    waitForConnections: true,
    connectionLimit: 10,  // กำหนดจำนวน Connection สูงสุด
    queueLimit: 0
});

var app = express();
app.use(cors());
app.use(express.json());

// ✅ ตรวจสอบการเชื่อมต่อฐานข้อมูล
Connection.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
    } else {
        console.log('✅ Database Connected Successfully');
        conn.release(); // ปล่อย connection กลับไปที่ pool
    }
});

app.listen(5000, function () {
    console.log('🚀 CORS-enabled web server running on port 5000');
});

// 🔹 ดึงข้อมูลผู้ใช้ทั้งหมด
app.get('/product', function (req, res) {
    Connection.query('SELECT * FROM product', function (err, results) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// 🔹 ดึงข้อมูลผู้ใช้ตาม ID
app.get('/product/:id', function (req, res) {
    const id = req.params.id;
    Connection.query('SELECT * FROM product WHERE id = ?', [id], function (err, results) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({
            status: '200',
            message: 'product Retrieved',
            results: results.length,
            data: results
        });
    });
});

// 🔹 เพิ่มผู้ใช้ใหม่
app.post('/product/create', function (req, res) {
    const { product_name, product_price	,  product_cost, product_image } = req.body;
    Connection.query(
        'INSERT INTO users(product_name, product_price, product_cost, product_image) VALUES (?, ?, ?, ?, ?)',
        [product_name, product_price, product_cost, product_image],
        function (err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                status: '201',
                message: 'product Created',
                data: results
            });
        }
    );
});

// 🔹 อัปเดตข้อมูลผู้ใช้
app.put('/product/update', function (req, res) {
    const { product_name, product_price	,  product_cost, product_image } = req.body;
    Connection.query(
        'UPDATE users SET product_name=?, product_price=?, product_cost=?, product_image=?  WHERE id=?',
        [product_name, product_price, product_cost, product_image,id],
        function (err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                status: '200',
                message: 'product Updated',
                affectedRows: results.affectedRows,
                data: results
            });
        }
    );
});

// ✅ DELETE ลบผู้ใช้ตาม ID (ใช้ req.params)
app.delete('/product/delete/:id', function (req, res) {
    const id = req.params.id;
    Connection.query(
        'DELETE FROM product WHERE id = ?',
        [id],
        function (err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                status: '200',
                message: 'product Deleted',
                affectedRows: results.affectedRows
            });
        }
    );
});

// ✅ DELETE อีกแบบ (ใช้ req.body)
app.delete('/product/delete', function (req, res) {
    const id = req.body.id;
    Connection.query(
        'DELETE FROM product WHERE id = ?',
        [id],
        function (err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                status: '200',
                message: 'product Deleted',
                affectedRows: results.affectedRows
            });
        }
    );
});
