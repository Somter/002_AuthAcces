var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var sql = require('mssql');

var jsonParser = bodyParser.json();
app.use(jsonParser);

var port = 8080;

var config = {
    server: 'LAPTOP-PL7SGEB9\\SQLEXPRESS',
    database: 'Atb',
    user: 'admin',
    password: 'admin',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    port: 1433
};

sql.connect(config, function (err) {
    if (err) {
        console.log("Error while connecting to database:", err);
    } else {
        console.log("Connected to SQL database!");
    }
});

app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    secret: 'supersecret',
    resave: false
}));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', async function (req, res) {
    try {

        const request = new sql.Request();
        const result = await request.query(`
            SELECT username FROM NewUsers 
            WHERE username = '${req.body.username}' AND password = '${req.body.password}'
        `);

        if (result.recordset.length > 0) {
            req.session.username = req.body.username;
            console.log("Login succeeded: ", req.session.username);
            res.send('Login successful: ' + 'sessionID: ' + req.session.id + '; user: ' + req.session.username);
        } else {
            console.log("Login failed: ", req.body.username);
            res.status(401).send('Login error');
        }
    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', function (req, res) {
    req.session.username = '';
    console.log('logged out');
    res.send('logged out!');
});

app.get('/admin', function (req, res) {
    if (req.session.username == 'admin') {
        console.log(req.session.username + ' requested admin page');
        res.render('admin_page');
    } else {
        res.status(403).send('Access Denied!');
    }
});

app.get('/user', function (req, res) {
    if (req.session.username && req.session.username.length > 0) {
        console.log(req.session.username + ' requested user page');
        res.render('user_page');
    } else {
        res.status(403).send('Access Denied!');
    }
});

app.get('/guest', function (req, res) {
    res.render('guest_page');
});


app.listen(port, function () {
    console.log('App running on port ' + port);
});
