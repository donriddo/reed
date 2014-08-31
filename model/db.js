var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/reed';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
   console.log('Mongoose connected to: ' + dbURI); 
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose terminated through app');
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    fullname: String,
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    passToken: String,
    regDate: {type: Date, 'default': Date.now},
    regToken: String,
    activated: {type: Boolean, 'default': false},
    picUrl: String,
    activationDate: Date,
    lastLogin: Date,
    dob: Date,
    tel: String,
    bio: String,
    address: String,
    completed: {type: Boolean, 'default': false},
    friends: {type: Array, 'default': []},
    requests: {type: Array, 'default': []}
});

mongoose.model('User', userSchema);