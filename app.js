// لاستدعاء mysql
const mysql = require('mysql'),
	express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	app = express(),
	admin_Router = require('./routes/admin_Router'),
	files_Router = require('./routes/files_Router'),
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
	password: 'nabtkerDB67&',
	database: 'nabtkerdb',
	connectionLimit: 10,
};

//  للاتصال بقاعدة البيانات
const conn = mysql.createConnection(DB_INFO);

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

// صفحة تسجيل الدخول
app.get('/login', (req, res) => {
	res.sendFile('/views/login.html', {root: __dirname});
});

// للتحقق من بيانات المستحدم من اجل تسجيل الدخول الي لوحة التحكم
app.post('/login', (req, res) => {
	const {username, password} = req.body;
	try {
		var DBuserCheck = `SELECT EXISTS (SELECT * FROM admininfo WHERE username ="${username}")`;
		var DBpwdCheck = `SELECT username, password FROM admininfo where username = "${username}" AND password = "${password}"`;
		conn.query(DBuserCheck, function (err, data) {
			if (err) {
				res.send(err);
			} else {
				conn.query(DBpwdCheck, function (err, userData) {
					if (userData[0].username === username && userData[0].password === password) {
						res.json({info: userData[0], redirect: '/nabtker/dashboard'});
					}
				});
			}
		});
	} catch (ex) {
		res.send(ex);
	}
});


// اضافة، تعديل، حذف المشرف
app.use('/admin', admin_Router)


// رفع ، تعديل ، حذف، تفاصل الملف
app.use('/file', files_Router)



// لفتح خادم
app.listen(port);

// يتم عرض هذه الصفحة عندما تذهب الي رابط صفخة غير موجودة
app.use((req, res) => {
	res.sendFile('/views/404.html', {root: __dirname});
});
