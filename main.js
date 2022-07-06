//imports de dépendances
require('dotenv').config();
const colors = require('colors');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la bdd
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connecté à la base de données!!"))

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'ma cle secrete',
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

// template engine
app.set('view engine', 'ejs');

// routes
app.use('', require('./routes/routes'));

app.listen(PORT, () => {
    console.log(`.: --------------------------------:.`.bgBlack.green);
    console.log(`.: Express is running at http://localhost:${PORT} :.`.bgBlack.yellow);
    console.log(`.: --------------------------------:.`.bgBlack.red);
});