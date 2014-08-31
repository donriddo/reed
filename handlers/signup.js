var mongoose = require('mongoose');
var User = mongoose.model('User');
var fs = require('fs');
exports.exists = function(req, res) {
   
};
exports.view = function (req, res) {
    if (req.query.exist) {
        res.render('signup', {title: "Sign up", error: "Email or Username has been chosen. Please cross-check to confirm."}); 
    } else if (req.query.error) {
         res.render('signup', {title: "Sign up", error: "There was an error signing up. Please try again."});
    } else {
        res.render('signup', {title: 'Sign up - Step 1'});
    }
};

exports.preSignup = function(req, res) {
    var body = req.body;
    User.create({
        username: body.username,
        email: body.email,
        passToken: body.password
    }, function (err, user) {
        if (!err) {
            req.session.username = body.username;
            console.log('User successfully created with details: ' + user);
            res.redirect('/signup/2');
        } else if (err.code === 11000) {
            User.findOne({username: body.username}, function (err, user) {
                if (user && user.completed === false) {
                    res.cookie('username', user.username, {signed: true});
                    res.redirect('/signup/2');
                } else {
                    res.redirect('/signup?exist=true');
                }
            }); 
        } else {
            console.log('error creating User: ' + err);   
            res.redirect('/signup?error=true');
        }
    });
};

exports.step_two = function (req, res) {
    if (req.session.username) {
        res.render('signup-two', {title: 'Sign up - Step 2'});
    } else {
        res.render('signup', {title: 'Sign up - Step 1'});
    }
};

exports.signup = function (req, res, next) {
        
// the below code is a temporary snippet which checks to see if user currently has a photo before updating it. 
// this will later be handled by the app.get('/account/edit') route. i intentionally did not comment it out just to see its work.
//        
//        fs.readdir('./public/userPhotos/', function (err, photos) {
//            if (!err) {
//                for (i in photos) {
//                    if (photos[i].split('.')[0] === req.session.username) {
//                        var former_pic_path = './public/userPhotos/' + photos[i];
//                        fs.unlink(former_pic_path, function (err) {
//                            if (err) {
//                                console.log('Error deleting former user picture: ' + err);
//                            } else {
//                                console.log('Deleting ' + former_pic_path);
//                                console.log('User has a picture on our database before and it has been successfully deleted');
//                            }
//                        });
//                    }
//                }
//            } else {
//                console.log('fs cannot fetch contents of the directory : ' + err);
//            }
//        });
            
    var body = req.body
    , pic = req.files.picture
    , pic_path;
    if (pic.name !== '') {
        var tmp_path = pic.path
        , ext = tmp_path.split('.')[1]
        , target_path = './public/userPhotos/' + req.session.username + '.' + ext;
        
        fs.rename(tmp_path, target_path, function(err) {
            if (err) { console.log(err); }
            fs.unlink(tmp_path, function(err) {
                if(err) { console.log(err); }
                pic_path = "/userPhotos/" + target_path.split('/')[3];
                console.log("this is the pic_path: " + pic_path);
                console.log('file uploaded to: ' + target_path + ' as ' + pic_path + ' which is ' + pic.size + 'bytes');
                User.findOne({username: req.session.username}, function (err, user) {
                    if (user) {
                        user.fullname = body.fullname;
                        user.address = body.address;
                        user.dob = body.dob;
                        user.bio = body.bio;
                        user.tel = body.tel;
                        user.picUrl = pic_path;
                        user.completed = true;
                        user.save();
                        console.log('Final user details: ' + user);
                        res.redirect('/signin');
                    } else {
                        res.redirect('/signup');
                    }
                });
            });
        });
    }
    
};