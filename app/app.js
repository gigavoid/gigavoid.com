var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var multer = require('multer');

var routes = require('./routes/index');
var admin = require('./routes/admin');

var db = require('monk')(process.env.DB || 'localhost/gigavoid'); // pw in future

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('database', db);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(multer({ dest: './uploads/'}));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.year = function(){
    return new Date().getFullYear();
};

app.use(session({
    secret: 'faceroll:cde xvf gnvfdcxsezwaq<'
}))

app.use('/', routes);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
