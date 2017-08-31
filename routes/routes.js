var playerController = require('../controllers/playerController');
var golferController = require('../controllers/golferController');
var scoreboardController = require('../controllers/scoreboardController');
var adminController = require('../controllers/adminController');
var passwordController = require('../controllers/passwordController');

module.exports = function(app, passport) {
  app.get('/', isLoggedIn, scoreboardController.create_get);
  app.post('/', isLoggedIn, isAdmin, scoreboardController.create_post);

  app.get('/login', function(req, res){
    res.render('login', { message: req.flash('loginMessage'), user: false });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', function(req, res){
    res.render('signup', { message: req.flash('signupMessage'), user: false });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  app.get('/golfer', isLoggedIn, isAdmin, golferController.create_get);
  app.post('/golfer', isLoggedIn, isAdmin, golferController.create_post);

  app.get('/admin/players', isLoggedIn, isAdmin, adminController.get_players);
  app.post('/admin/players', isLoggedIn, isAdmin, adminController.post_players);

  app.get('/admin/players/addPlayer', isLoggedIn, isAdmin, playerController.create_get);
  app.post('/admin/players/addPlayer', isLoggedIn, isAdmin, playerController.create_post);

  app.get('/admin/users', isLoggedIn, isAdmin, adminController.get_users);
  app.post('/admin/users', isLoggedIn, isAdmin, adminController.post_delete_users);

  app.get('/forgot', passwordController.get_forgot);
  app.post('/forgot', passwordController.post_forgot);

  app.get('/reset/:token', passwordController.get_reset);
  app.post('/reset/:token', passwordController.post_reset);
};

function isLoggedIn(req, res, next){
  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
}

function isAdmin(req, res, next){
  if (req.user.local.admin === true)
    return next();

  res.redirect('/');
}
