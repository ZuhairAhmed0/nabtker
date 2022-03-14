const express = require('express'),
	mysql = require('mysql'),
	fs = require('fs'),
	multer = require('multer');

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

// لرفع الملفات من الجهاز وتحزينها في folder uploads
const storage = multer.diskStorage({
	destination: (reg, file, cp) => {
		cp(null, 'public/uploads');
	},
	filename: (reg, file, cp) => {
		const {originalname} = file;
		cp(null, originalname);
	},
});
const uploadToDatabase = multer({storage});

// لتحزين بيانات الملف في قاعدة البيانات
router.post(
	'/upload',
	uploadToDatabase.fields([
		{name: 'fileSrc', maxCount: 1},
		{name: 'fileImg', maxCount: 1},
	]),
	(req, res) => {
		const fileSrc = req.files.fileSrc[0].filename;
		const fileImg = req.files.fileImg[0].filename;
		const fileName = req.body.fileName;
		const author = req.body.authorName;
		const countPages = req.body.countPages;
		const dateVersion = req.body.dateVersion;
		conn.connect((err) => {
			let sql = `INSERT into filesupload(fileSrc, fileName, fileImg, author, countPages, dateVersion)values('${fileSrc}','${fileName}','${fileImg}','${author}','${countPages}','${dateVersion}')`;
			conn.query(sql);
			res.redirect('/nabtker/dashboard');
		});
	},
);

// لجلب بيانات الملف من قاعدة البيانات
router.get('/upload', (req, res) => {
	conn.query('select * from filesupload', (err, result, fields) => {
		if (err) {
			return err;
		}
		res.json(result);
	});
});

//  لتعديل بيانات الملف في الصفحة وقاعدة البيانات
router.post('/edit/:id', (req, res) => {
	conn.connect((err) => {
		let sql = `UPDATE filesupload SET fileName = "${req.body.new_fileName}", author = "${req.body.new_authorName}", countPages = "${req.body.new_countPages}", dateVersion = "${req.body.new_dateVersion}" WHERE (id = "${req.params.id}")`;
		conn.query(sql);
		res.redirect('/nabtker/dashboard');
	});
});

// لحذف ملف معين
router.delete('/Delete/:id', (req, res) => {
	conn.connect((err) => {
		let sql = `DELETE from filesupload where id = "${req.params.id}"`;
		let deleteFile = `select fileSrc , fileImg from filesupload where id = "${req.params.id}"`;
		conn.query(deleteFile, (err, result_file, fields) => {
			fs.unlink(`./public/uploads/${result_file[0].fileSrc}`, (err) => {
				fs.unlink(`./public/uploads/${result_file[0].fileImg}`, () => {
					conn.query(sql);
				});
			});
			res.json('deleted successfully');
		});
	});
});

// لعرض تفاصيل الملف
router.get('/details/:id', (req, res) => {
	const detailsFile = `select * from filesupload where id=${req.params.id}`;
	conn.query(detailsFile, (err, result) => {
		res.render('details', {data: result});
	});
});

module.exports = router;
