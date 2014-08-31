var mongoose = require('mongoose');
var fs = require('fs');
var User = mongoose.model('User');

exports.home = function(req, res) {
    if (req.session.loggedIn === true) {
        res.render('home', {
            title: "Reed",
            name: req.session.user.username,
            email: req.session.user.email,
            picUrl: req.session.picUrl,
            fullname: req.session.user.fullname
        })
    } else {
        res.redirect('/signin');
    }
};

exports.showEdit = function (req, res) {
    console.log("You requested " + req.url + " and are you logged in? " + req.session.loggedIn);
    if (req.session.loggedIn === true) {
        User.findById(req.session.user.user_id, function (err, user) {
            if (user) {
                res.render('profile-edit', {
                    title: 'Edit Profile',
                    fullname: user.fullname,
                    email: user.email,
                    dob: user.dob,
                    tel: user.tel,
                    bio: user.bio,
                    username: user.username
                });
            } else {
                console.log("Cannot get the current user due to: " + err);
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.edit = function (req, res) {
    if (req.session.loggedIn === true) {
        var body = req.body;
        User.findById(req.session.user.user_id, function (err, user) {
            if (user && user.passToken == body.password) {
                user.fullname = body.fullname;
                user.tel = body.tel;
                user.bio = body.bio;
                user.save(function (err, user) {
                    if (user) {
                        console.log("User details successfully updated: " + user);
                        res.redirect('/home/profile');
                    } else {
                        console.log("Error updating user details: " + err);
                        res.redirect('/account/edit');
                    }
                });
            } else {
                console.log("Cannot get the current user due to: " + err);
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.changeDob = function (req, res) {
    if (req.session.loggedIn === true) {
        var body = req.body;
        User.findById(req.session.user.user_id, function (err, user) {
            if (user && user.passToken == body.password) {
                user.dob = body.dob;
                user.save(function (err, user) {
                    if (user) {
                        console.log("User Date of Birth successfully updated: " + user);
                        res.redirect('/home/profile');
                    } else {
                        console.log("Error updating user Date of Birth details: " + err);
                        res.redirect('/account/edit');
                    }
                });
            } else {
                console.log("Cannot get the current user due to: " + err);
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.changeMail = function (req, res) {
    if (req.session.loggedIn === true) {
        var body = req.body;
        User.findById(req.session.user.user_id, function (err, user) {
            if (user && user.passToken == body.password) {
                user.email = body.email;
                user.save(function (err, user) {
                    if (user) {
                        console.log("User Email successfully updated: " + user);
                        res.redirect('/home/profile');
                    } else {
                        console.log("Error updating user Email: " + err);
                        res.redirect('/account/edit');
                    }
                });
            } else {
                console.log("Cannot get the current user due to: " + err);
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.changePass = function (req, res) {
    if (req.session.loggedIn === true) {
        var body = req.body;
        User.findById(req.session.user.user_id, function (err, user) {
            if (user && user.passToken == body.password && body.newPass == body.retype) {
                user.passToken = body.newPass;
                user.save(function (err, user) {
                    if (user) {
                        console.log("User Password successfully updated: " + user);
                        res.redirect('/home/profile');
                    } else {
                        console.log("Error updating user password: " + err);
                        res.redirect('/account/edit');
                    }
                });
            } else {
                console.log("Cannot get the current user due to: " + err);
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.logout = function (req, res) {
    if (req.session.loggedIn === true) {
        console.log("before destroying: ");
        console.log(req.session);
        delete req.session;
        console.log('after destroying: ' + req.session);
        res.redirect('/signin');
    } else {
        res.redirect('/signin');
    }  
};

exports.confirmDelete = function (req, res) {
    if (req.session.loggedIn === true) {
        res.render('deleteUser', {title: 'Delete User'});
    } else {
        res.redirect('/signin');
    }  
}; 

exports.delete = function (req, res) {
    if (req.session.loggedIn === true) {
        var body = req.body;
        User.findById(req.session.user.user_id, function(err, user) {
            if (user && user.passToken == body.password) {
                User.findByIdAndRemove(user._id, function (err, deleted) {
                    if (err) {
                        console.log("Error deleting User account: " + err);
                    } else {
                        delete req.session;
                        fs.unlinkSync('./public' + user.picUrl);
                        console.log("User account deleted successfully: " + deleted);
                        res.redirect('/signin');
                    }
                });
            } else {
                console.log("Cannot get the current user due to: " + err);
                res.redirect('/home');
            }
        });
    } else {
        res.redirect('/signin');
    }  
};

exports.find = function (req, res) {
    if (req.session.loggedIn === true) {
        User.find({'completed': true}, function (err, users) {
            if (users) {
                res.render('display-users', {title: "Find Friends", users: users});
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.addFriend = function (req, res) {
    if (req.session.loggedIn === true) {
        User.findById(req.params.id, function (err, friend) {
            if (friend) {
                User.findById(req.session.user.user_id, function (err, user) {
                    if (user) {
                        user.friends.push({
                            'id': friend._id,
                            'friendshipDate': new Date(),
                            'accepted': false
                        });
                        user.save(function (err, saved) {
                            console.log('User Friend list: ' + saved.friends);
                            friend.requests.push({
                                'id': saved._id,
                                'friendshipDate': new Date(),
                                'accepted': false
                            });
                            friend.save(function (err, friend) {
                                console.log('A request has been sent to ' + friend.username + ' of id: ' + friend._id);
                                console.log(friend.username + ' request list: ' + friend.requests);
                            })
                            
                        });
                        res.redirect('/account/friends');
                    } else {
                        console.log('error getting current user' + err);
                        res.redirect('/home');
                    }
                });
            } else {
                console.log('User to be added as friend does not exist');
                res.redirect('/account/find/friends');
            }
        });
    } else {
        res.redirect('/signin');
    }
};

exports.friends = function (req, res) {
    if (req.session.loggedIn === true) {
        User.findById(req.session.user.user_id, function (err, user) {
            if (user) {
                var friends = []
                , hack = 1;
                for (var i = 0; i < user.friends.length; i++) {
                    User.findById(user.friends[i]['id'], function (err, friend) {
                        if (friend) {
                            friends.push(friend);
                            console.log(friends);
                            if (hack === user.friends.length) {
                                console.log('**********************************************');
                                console.log('********************************************************');
                                console.log(friends);
                                res.render('friends', {title: 'Friends', friends: friends, empty: false});
                            }
                            hack++
                            
                        }
                    });
                }

            } else {
                res.render('friends', {title: 'Friends', empty: true});
            }
        });
    } else {
        res.redirect('/signin');
    }
};