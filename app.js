var express = require('express');
var app = express();
var cons = require("consolidate");
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var fs = require('fs');
mongoose.connect(dbConfig.url);
var busboy = require('connect-busboy');
app.use(busboy());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var auth = require("./routes/auth.js");
var song = require("./routes/songs.js");
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use("/", auth);
app.use("/", song);

app.engine('html', cons.nunjucks);
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index');
});
app.use(express.static(__dirname, 'public'));

app.post('/upload', function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        var fstream = fs.createWriteStream('./songs/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
           //res.redirect('back');
        })
    });
});

module.exports = app;