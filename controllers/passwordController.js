var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var User = require('../models/user');

exports.get_forgot = function(req, res){
  res.render('forgot', { user: false });
}

exports.post_forgot = function(req, res, next){
  async.waterfall([
    function(done){
      crypto.randomBytes(20, function(err, buf){
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done){
      User.findOne({"local.email": req.body.email}, function(err, user){
        if (!user){
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('forgot');
        }

        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000;

        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done){
      var transport = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
          user: 'golfpooltournament@gmail.com',
          pass: 'Gscoreboard1T'
        }
      }));
      var mailOptions = {
        to: user.local.email,
        from: 'passwordreset@golftournament.com',
        subject: 'Golf Tournament Password Reset',
        text: 'You are receiving this because you (or someone else) has requested the reset of the password for your account. \n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transport.sendMail(mailOptions, function(err){
        req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' wuth further instructions.');
        done(err, 'done');
      });
    }
  ], function(err){
    if (err) return next(err);
    res.redirect('/');
  });
}

exports.get_reset = function(req, res){
  User.findOne({"local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user){
    if (!user){
      req.flash('error', 'Password reset token is invalid or has expired');
      return res.redirect('/');
    }
    res.render('reset', { user: false });
  })
}

exports.post_reset = function(req, res){
  async.waterfall([
    function(done){
      User.findOne({"local.resetPasswordToken": req.params.token, "local.resetPasswordExpires": { $gt: Date.now() } }, function(err, user){
        if (!user){
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/');
        }
        var newUser = new User();
        user.local.password = newUser.generateHash(req.body.password);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;
        user.save(function(err){
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done){
      var transport = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
          user: 'golfpooltournament@gmail.com',
          pass: 'Gscoreboard1T'
        }
      }));
      var mailOptions = {
        to: user.local.email,
        from: 'passwordreset@golftournament.com',
        subject: 'Golf Tournament Password Reset',
        text: 'Hello, \n\n' +
          'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
      };
      transport.sendMail(mailOptions, function(err){
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/login');
  });
}
