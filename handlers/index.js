
/*
 * GET home page.
 */

exports.index = function(req, res){
//    if (req.signedCookies.loggedIn === "in")
//        res.redirect('/home');
//    else
        res.render('index', { title: 'Reed' });
};