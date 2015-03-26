var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.post('/authenticate', function(req, res){
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
        if(err){
            res.json({
                type: false,
                data: "Error occurred: " + err
            });
        }else{
            if(user){
                res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            }else{
                res.json({
                    type: false,
                    data: 'Incorrect email/password'
                });
            }
        }
    });
});

router.post('/register', function(req, res){
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user){
        if(err){
            res.json({
                type: false,
                data: "Error occurred: " + err
            });
        }else{
            if(user){
                res.json({
                    type: false,
                    data: 'User already exists'
                });
            }else{
                var newUser = new User();
                newUser.email = req.body.email;
                newUser.password = req.body.password;
                newUser.save(function(err, user){
                    user.token = jwt.sign(user, "shhhhhh");
                    user.save(function(err, user1){
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                });
            }
        }
    });
});

module.exports = router;