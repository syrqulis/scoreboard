var async = require('async');

var Golfer = require('../models/golfer');
var Tournament = require('../models/tournament');
var Player = require('../models/player');
var User = require('../models/user');

exports.get_players = function(req, res){
  Player.find({}).exec(function(err, players)
  {
    res.render('players', { title: 'Manage Players', players: players, user: req.user.local })
  });
}

exports.post_players = function(req, res){
  var deleteArray = req.body.checked;
  async.series([
    function(callback){
      Player.remove({"name": deleteArray}, function(err){ if (err) { return console.log(err) }})
      callback(null);
    }],
    function(err, result){
      if (err) { return console.log(err) }
      res.redirect('players');
    }
  );
}

exports.get_users = function(req, res){
  User.find({}).exec(function(err, users)
  {
    res.render('users', { title: 'Manage Users', users: users, user: req.user.local })
  });
}

exports.post_delete_users = function(req, res){
  var deleteArray = req.body.checked;
  var adminArray = req.body.adminChecked
  async.waterfall([
    function(callback){
      User.find({"local.email": deleteArray}).exec(function(err, toDeleteUsers){
        if (err) { return console.log(err) }
        callback(null, toDeleteUsers);
      })
    },
    function(toDeleteUsers, callback){
      for (i=0; i < toDeleteUsers.length; i++){
        if (toDeleteUsers[i].local.admin) { return res.redirect('users') }
      }
      User.remove({"local.email": deleteArray}, function(err){ if (err) { return console.log(err) }})
      callback(null, toDeleteUsers);
    }],
    function(err, result){
      if (err) { return console.log(err) }
      res.redirect('users');
    }
  );
}
