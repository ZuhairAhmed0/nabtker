// لاستدعاء mysql
const mysql = require('mysql'),
	express = require('express'),
	cors = require('cors'),
	fs = require('fs'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	app = express(),
	port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//بيانات قاعدة البيانات
const DB_INFO = {
	host: 'localhost',
	user: 'root',
	password: 'zuhairDB67&',
	database: 'tests',
	connectionLimit: 10,
};

//  للاتصال بقاعدة البيانات
const pool = mysql.createPool(DB_INFO);
const con = mysql.createConnection(DB_INFO);

// الصفحة الرئسية
app.get('/', (req, res) => {
	res.sendFile('/views/index.html', {root: __dirname});
});

// صفحة لوحة التحكم
app.get('/nabtker/dashboard', (req, res) => {
	res.sendFile('/views/dashboard.html', {root: __dirname});
});

// صفحة لاضافة ادمن جديد
app.get('/addNewAdmin', (req, res) => {
	res.sendFile('/views/addNew.html', {root: __dirname});
});

//صفحة تفاصيل الكتاب
// app.get('/details', (req, res) => {
// 	res.sendFile('/views/details.html', {root: __dirname});
// });

// صفحة تسجيل الدخول
app.get('/login', (req, res) => {
	res.sendFile('/views/login.html', {root: __dirname});
});

// للتحقق من بيانات المستحدم من اجل تسجيل الدخول الي لوحة التحكم
app.post('/login', (req, res) => {
	const {username, password} = req.body;
	try {
		var DBuserCheck = `SELECT EXISTS (SELECT * FROM admininfo WHERE username ="${username}")`;
		var DBpwdCheck = `SELECT * FROM admininfo where username = "${username}" AND password = "${password}"`;
		pool.query(DBuserCheck, function (err, data) {
			if (err) {
				res.send(err);
			} else {
				pool.query(DBpwdCheck, function (err, userData) {
					res.json(userData[0]);
				});
			}
		});
	} catch (ex) {
		res.send(ex);
	}
});

//  لجلب جميع الادمن من قاعدة البيانات
app.get('/allAdmin', (req, res) => {
	pool.query('select id, name, email from admininfo', (err, result, fields) => {
		if (err) {
			return err;
		}
		res.json(result);
	});
});

//  لاضافة ادمن جديد في قاعدة البيانات
app.post('/addNewAdmin', (req, res) => {
	if (req.body.name && req.body.username && req.body.email && req.body.password) {
		let email = req.body.email;
		con.connect((err) => {
			let sql = `INSERT into admininfo(name, username,email,password)values('${req.body.name}','${req.body.username}','${email}','${req.body.password}')`;
			con.query(sql, (err, result) => {
				if (err) throw err;
				res.redirect('nabtker_dashboard');
			});
		});
	}
});

// لتعديل بيانات ادمن معين
app.put('/editAdminInfo/:id', (req, res) => {
	if (req.body.name && req.body.username && req.body.email && req.body.password) {
		let email = req.body.email;
		con.connect((err) => {
			let sql = `UPDATE admininfo SET name = '${req.body.name}', username = '${req.body.username}', email = '${email}', password = '${req.body.password}' WHERE (id = '${req.params.id}');
			`;
			con.query(sql, (err, result) => {
				if (err) throw err;
				res.json('edit successfully');
			});
		});
	}
});

//  لحذف ادمن معين
app.delete('/DeleteAdmin/:id', (req, res) => {
	con.connect((err) => {
		let sql = `DELETE from admininfo where id = "${req.params.id}"`;
		let sql2 = 'SELECT * from admininfo';
		con.query(sql2, (err, checkAdmin) => {
			if (checkAdmin.length != 1) {
				con.query(sql, (err, result) => {
					res.json({msg: 'deleted successfully', id: checkAdmin.length});
				});
			} else {
				res.json({msg: 'Connet Delete Admin Master', id: checkAdmin.length});
			}
		});
	});
});

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
app.post(
	'/uploadFiles',
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
		con.connect((err) => {
			let sql = `INSERT into filesupload(fileSrc, fileName, fileImg, author, countPages, dateVersion)values('${fileSrc}','${fileName}','${fileImg}','${author}','${countPages}','${dateVersion}')`;
			con.query(sql);
			res.redirect('nabtker_dashboard');
		});
	},
);

// لجلب بيانات الملف من قاعدة البيانات
app.get('/uploadFiles', (req, res) => {
	pool.query('select * from filesupload', (err, result, fields) => {
		if (err) {
			return err;
		}
		res.json(result);
	});
});

//  لتعديل بيانات الملف في الصفحة وقاعدة البيانات
app.post('/editFiles/:id', (req, res) => {
	con.connect((err) => {
		let sql = `UPDATE filesupload SET fileName = "${req.body.new_fileName}", author = "${req.body.new_authorName}", countPages = "${req.body.new_countPages}", dateVersion = "${req.body.new_dateVersion}" WHERE (id = "${req.params.id}")`;
		con.query(sql);
		res.redirect('/nabtker_dashboard');
	});
});

// لحذف ملف معين
app.delete('/DeleteFiles/:id', (req, res) => {
	con.connect((err) => {
		let sql = `DELETE from filesupload where id = "${req.params.id}"`;
		let deleteFile = `select fileSrc , fileImg from filesupload where id = "${req.params.id}"`;
		con.query(deleteFile, (err, result_file, fields) => {
			fs.unlink(`./public/uploads/${result_file[0].fileSrc}`, (err) => {
				fs.unlink(`./public/uploads/${result_file[0].fileImg}`, () => {
					con.query(sql);
				});
			});
			res.json('deleted successfully');
		});
	});
});

// لعرض تفاصيل الملف
app.get('/details/:id', (req, res) => {
	const detailsFile = `select * from filesupload where id=${req.params.id}`;
	con.query(detailsFile, (err, result) => {
		res.render('details', {data: result});
	});
});

// لفتح خادم
app.listen(port);

// يتم عرض هذه الصفحة عندما تذهب الي رابط صفخة غير موجودة
app.use((req, res) => {
	res.sendFile('/views/404.html', {root: __dirname});
});
