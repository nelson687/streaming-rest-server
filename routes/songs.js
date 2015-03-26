var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var fs = require('fs');
var id3 = require('id3js');
router.get('/me', ensureAuthorized, function(req, res){
    User.findOne({token: req.token}, function(err, user){
        if(err){
            res.json({
                type: false,
                data: 'error'
            });
        } else if(user){
            res.json({
                type: true,
                data: user
            });
        }else{
            res.json({
                type: false,
                data: 'incorrect token'
            });
        }
    });
});

router.get('/nelson', function(req, res){
   res.send("todo ok");
});

router.get('/getSongs', ensureAuthorized, function(req, res){
    var songsList = fs.readdirSync("./songs/");
    var songs = []
    songsList.forEach(function(song){
        var songJson = {};
        id3({ file: './songs/' + song, type: id3.OPEN_LOCAL }, function(err, tags) {
            if( tags.title === null){
                songJson['title'] = song.split('.')[0];
            }else{
                songJson['title'] =  tags.title;
            }
            songJson['artist'] = tags.artist;
            songJson['image'] = tags.image;
            songJson['file'] = 'http://localhost:3000/songs/' + song;
            songs.push(songJson);
            if(songs.length === songsList.length){
                res.send(songs);
            }
        });
    })
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        //var bearer = bearerHeader.split(" ");
        //bearerToken = bearer[1];
        req.token = bearerHeader;
        next();
    } else {
        res.send(403);
    }
}

module.exports = router;