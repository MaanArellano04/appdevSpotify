const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spotifydb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('connected to my sql database');
});

module.exports = db;