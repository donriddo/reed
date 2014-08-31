var mongoose = require('mongoose');
var User = mongoose.model('User');
exports.view = function (req, res) {
    res.render('signin', {title: 'Sign in'});
};
exports.signin = function (req, res) {
    User.findOne({email: req.body.email, passToken: req.body.password}, function(err, user) {
        if (user) {
//            res.cookie('username', user.username, {signed: true});
//            res.cookie('email', user.email, {signed: true});
//            res.cookie('user_id', user._id, {signed: true});
//            res.cookie('fullname', user.fullname, {signed: true});
            req.session.user = {"username": user.username, "user_id": user._id, "email": user.email, fullname: user.fullname};
            if ('undefined' !== typeof user.picUrl) {
                req.session.picUrl = user.picUrl;
            } else {
                req.session.picUrl = 'nophoto';
            }
            req.session.loggedIn = true;
            console.log(req.session);
            res.redirect('/home');
        } else {
            res.send(req.body.email + 'does not have an account on this platform');
        }
    });
};