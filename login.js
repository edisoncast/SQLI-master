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




app.use(express.static(path.join(__dirname, '/public')));

app.set('views', __dirname + '/views/');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Esto no lo necesito pues estoy sirviendo el


//Ruta para redireccionar al login
app.get('/', function(request, response) {
    response.render('login');
});

app.get('/new', function(request, response) {
    if (request.session.loggedin) {
        const news = request.query.id;
        if (news) {
            let newsQuery = "SELECT * FROM `news` WHERE id = " + news;
            connection.query(newsQuery, function(error, results, fields) {
                if (error) {
                    response.render('news');
                    return;
                }
                if (results.length > 0) {
                    let data = {
                        'id': results[0].id,
                        'title': results[0].title,
                        'body': results[0].body,
                        'Datetime': results[0].Datetime
                    };
                    response.render('news', { "data": data });
                } else {
                    response.send('Noticia no encontrada!').end();
                }
            });
        } else {
            response.render('news');
        }
    } else {
        response.send('Por favor haga login para ver esta página!').end();
    }
});

//Ruta para validar si un usuario puede ingresar

app.post('/auth', function(request, response) {
    const email = request.body.email;
    const password = request.body.password;
    if (email && password) {
        const hash = crypto.pbkdf2Sync(password, "S3cureSalt", 100, 127, 'sha512').toString('hex');
        connection.query('SELECT * FROM `users` WHERE email = ? AND password = ?', [email, hash], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.email = email;
                response.redirect('new');
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

app.listen(3000, () => console.log('Servidor ejecutando en http://localhost:3000/'));