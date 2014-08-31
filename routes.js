var routes = require('./handlers');
var user = require('./handlers/user');
var signin = require('./handlers/signin');
var signup = require('./handlers/signup');


module.exports = function (app) {
    app.get('/', routes.index);
    app.get('/signin', signin.view);
    app.post('/signin', signin.signin);
    app.get('/signup', signup.view);
    app.post('/signup', signup.preSignup);
    app.get('/signup/2', signup.step_two);
    app.post('/signup/2', signup.signup);
    app.get('/home', user.home);
    app.get('/account/edit', user.showEdit);
    app.post('/account/edit', user.edit);
    app.post('/account/edit/dob', user.changeDob);
    app.post('/account/edit/email', user.changeMail);
    app.post('/account/edit/password', user.changePass);
    app.get('/account/logout', user.logout);
    app.get('/account/delete', user.confirmDelete);
    app.post('/account/delete', user.delete);
    app.get('/account/find/friends', user.find);
    app.get('/account/add/friend/:id', user.addFriend);
    app.get('/account/friends', user.friends);
    app.get('/download', function (req, res) {
        res.download('onePiece.mkv', 'one-piece-episode-646.mkv', function (err) {
            if (err)
                console.log(err);
            else
                console.log('file successfully downloaded by the client');
        });
    });

    app.use(function (req, res) {
        res.status(404);
        if (req.session.loggedIn === true)
            res.render('404-home', {title: "404", url: req.url});
        else
            res.render('404', {title: "404", url: req.url});
    });
            
};
