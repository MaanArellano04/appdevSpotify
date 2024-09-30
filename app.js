const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const routes = require('./routs/router.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static('src'));
app.use('/', routes);
app.listen(3000, 'localhost', () => {
    console.log('http://localhost:3000');
});