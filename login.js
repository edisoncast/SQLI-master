const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

// Cadena de conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'debian-sys-maint',
    password: 'w2eXPu703pW8GjS2',
    database: 'master'
});

//Inicialización y configuración del módulo de express.
const app = express();

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("public"));

//Ruta para redireccionar al login
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/login.html'));
});

/*
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "main.css");
});*/

//Ruta para validar si un usuario puede ingresar


app.post('/auth', function(request, response) {
    const email = request.body.email;
    const password = request.body.password;
    if (email && password) {
        const hash = crypto.pbkdf2Sync(password, "S3cureSalt", 100, 127, 'sha512').toString('hex');
        let usernameQuery = "SELECT * FROM `users` WHERE email = '" + email + "' and password = '" + hash + "'";
        console.log("Consulta", usernameQuery);

        connection.query(usernameQuery, function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.email = email;
                response.redirect('/public/news.html');
            } else {
                response.send('Usuario o password incorrecto!');
            }
            response.end();
        });
    } else {
        response.send('Usted debe ingresar un usuario y un password!');
        response.end();
    }
});

app.get('/news', function(request, response) {
    if (request.session.loggedin) {
        response.send('Bienvenido de nuevo, ' + request.session.email + '!');
    } else {
        response.send('Por favor haga login para ver esta página!');
    }
    response.end();
});

app.listen(3000, () => console.log('Servidor ejecutando en http://localhost:3000/'));