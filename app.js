
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./model/db');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger({format: ':remote-addr :url :status'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: './public/userPhotos'
}));
app.use(express.methodOverride());
app.use(express.cookieParser('donriddo'));
app.use(express.cookieSession());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var routes = require('./routes')(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
