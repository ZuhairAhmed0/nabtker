const express = require('express');

const mysql = require('mysql')

const router = express.Router();

//بيانات قاعدة البيانات
const DB_INFO = {
	host: 'localhost',
	user: 'root',
	password: 'nabtkerDB67&',
	database: 'nabtkerdb',
	connectionLimit: 10,
};

//  للاتصال بقاعدة البيانات
const conn = mysql.createConnection(DB_INFO);


//  لجلب جميع الادمن من قاعدة البيانات
router.get('/all', (req, res) => {
	conn.query('select id, name, email from admininfo', (err, result, fields) => {
		if (err) {
			return err;
		}
		res.json(result);
	});
});

//  لاضافة ادمن جديد في قاعدة البيانات
router.post('/addNew', (req, res) => {
	if (req.body.name && req.body.username && req.body.email && req.body.password) {
		let email = req.body.email;
		conn.connect((err) => {
			let sql = `INSERT into admininfo(name, username,email,password)values('${req.body.name}','${req.body.username}','${email}','${req.body.password}')`;
			conn.query(sql, (err, result) => {
				if (err) throw err;
				res.redirect('/nabtker/dashboard');
			});
		});
	}
});

// لتعديل بيانات ادمن معين
router.put('/edit/:id', (req, res) => {
	if (req.body.name && req.body.username && req.body.email && req.body.password) {
		let email = req.body.email;
		conn.connect((err) => {
			let sql = `UPDATE admininfo SET name = '${req.body.name}', username = '${req.body.username}', email = '${email}', password = '${req.body.password}' WHERE (id = '${req.params.id}');
			`;
			conn.query(sql, (err, result) => {
				if (err) throw err;
				res.json('edit successfully');
			});
		});
	}
});

//  لحذف ادمن معين
router.delete('/Delete/:id', (req, res) => {
	conn.connect((err) => {
		let sql = `DELETE from admininfo where id = "${req.params.id}"`;
		let sql2 = 'SELECT * from admininfo';
		conn.query(sql2, (err, checkAdmin) => {
			if (checkAdmin.length != 1) {
				conn.query(sql, (err, result) => {
					res.json({msg: 'deleted successfully', id: checkAdmin.length});
				});
			} else {
				res.json({msg: 'Connet Delete Admin Master', id: checkAdmin.length});
			}
		});
	});
});


module.exports = router;