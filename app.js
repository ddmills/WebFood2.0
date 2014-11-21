var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var debug = require('debug')('webfood');
var User = require('./data/user');
var OrderRepo = require('./data/order');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('uncreative-secret'));
app.use(session({ secret: 'uncreative-secret', coookie: {httpOnly: false} }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var initPassport = require('./auth/passport-setup');
initPassport(passport);

var ensureAuthenticated = function(req, res, next) {
    debug('ensureAuthenticated invoked');
    // TODO: Remove, this disables required authentication for debugging
    return next();
    if (req.isAuthenticated()) { return next(); }
    res.status(401);
    res.send({ error: 'Authentication required' });
}

var router = express.Router();

/*
 * GET /restricted
 *
 * Test if you are authenticated. Returns the user object stored in session, or a 401 Unauthorized error
 * if not authenticated.
 */ 
router.get('/restricted', ensureAuthenticated, function(req, res) {
    debug('/restricted invoked');
    res.send({user: req.user});
});

/**
 * POST /api/create-order
 *
 * Create a new order
 *
 * Request Body:
 *     {
 *         "location": "<location>",
 *         "price": Number,
 *         "entree": "<entree>",
 *         "beverage": "<beverage>",
 *         "sides": ["sides1", "side2"],
 *         "other": "..."
 *     }
 * Response:
 *     {
 *         "_id": Number,
 *         "location": "<location>",
 *         "price": Number,
 *         "entree": "<entree>",
 *         "beverage": "<beverage>",
 *         "sides": ["sides1", "side2"],
 *         "other": "..."
 *     }
 */
router.post('/api/create-order', ensureAuthenticated, function(req, res) {
    debug('/api/create-order invoked');
    debug('order params: ', req.body);
    if (!req.body.location || !req.body.entree || !req.body.beverage || !req.body.price)
    {
        // Bad request, need to have at least these four parameters
        res.status(400).send({ "message": "Missing parameters. Requires beverage, entree, price, location" });
        return;
    }
    require('./data/connection')(function(err, db) {
        var Order = OrderRepo(db);
        Order.createOrder(req.body.location, req.body.price, req.body.entree, req.body.beverage, req.body.sides, req.body.other)
        .then(function (result) {
            debug('Result of create: ', result);
            res.send(result[0]);
        }, function (err) {
            res.status(500).send({"message": "Database error", err: err});
        });
    });
});

/**
 * POST /auth/login
 * 
 * Attempts to login to the system and start a session.
 * 
 * Request Body:
 * json with username and password fields: { "username": "<username>", "password": "<password>" }
 *
 * Response Body (success):
 * json object with user property, containing informatin about the user. Starts a session.
 */
router.post('/auth/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).send();
    }
    sess = req.session;
    sess.user = user;
    console.log(sess.user);
    req.user = user;
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({user: user});
    });
  })(req, res, next);
});

/**
 * POST /auth/register
 *
 * Attempt to register a user.
 *
 * Request Body:
 * json with a username and password field (see /auth/login route)
 *
 * Response Body (error):
 * If an error occurs, such as the user already exists, a 400 Bad Request response is sent back
 * 
 * Response Body (success):
 * Sends back information about the newly registered user and logs them in
 */
router.post('/auth/register', passport.registerUser);

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (typeof(process.env.DEBUG) !== 'undefined') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});


module.exports = app;
