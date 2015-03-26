var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
       username: String,
       password: String,
       token: String,
       email: String,
       gender: String,
       address: String
    });