var async = require('async');
var _ = require('underscore');

var Player = require('../models/player');
var Golfer = require('../models/golfer');

exports.create_get = function(req, res)
{
  var golfers = new Array;

  async.parallel(
  [
    function(callback){
      Golfer.find({}).exec(callback);
    }
  ], function(err, results)
  {
    if (err) throw err;
    for (i = 0; i < results[0].length; i++)
    {
      var temp = results[0][i].name;
      var spaceAt = temp.indexOf(' ');
      var golfer = temp.slice(spaceAt+1) + ', ' + temp.substr(0, spaceAt);
      golfers.push({name: golfer});
    }
    golfers = _.sortBy(golfers, 'name');
    res.render('AddPlayer', { title: 'Add Player', golfers: golfers, user: req.user.local })
  })
};

exports.create_post = function(req, res)
{
  req.checkBody('player_name', 'Player name required').notEmpty();
  req.checkBody('golfer1', 'Golfer required').notEmpty();
  req.checkBody('golfer2', 'Golfer required').notEmpty();
  req.checkBody('golfer3', 'Golfer required').notEmpty();

  var errors = req.validationErrors();

  var golfer1 = req.body.golfer1.substr(req.body.golfer1.indexOf(',')+2)
    + ' ' + req.body.golfer1.slice(0, req.body.golfer1.indexOf(','));
  var golfer2 = req.body.golfer2.substr(req.body.golfer2.indexOf(',')+2)
    + ' ' + req.body.golfer2.slice(0, req.body.golfer2.indexOf(','));
  var golfer3 = req.body.golfer3.substr(req.body.golfer3.indexOf(',')+2)
    + ' ' + req.body.golfer3.slice(0, req.body.golfer3.indexOf(','));

  var player = new Player(
    {
      name: req.body.player_name,
      golfer1: golfer1,
      golfer2: golfer2,
      golfer3: golfer3,
      score: 0
    }
  )

  if (errors)
  {
    res.render('players', { title: 'Manage Players', errors: errors, user: req.user.local })
    return;
  }
  else
  {
    Player.findOne({ 'name': req.body.player_name })
    .exec(function(err, found_player)
    {
      console.log('found player: ', + found_player);
      if (err) { return next(err); }
      if (found_player) {
        res.render('addPlayer', { title: 'Add Player', notadded: 'Player already exists', user: req.user.local });
      }
      else
      {
        player.save(function (err)
        {
          if (err) { return next(err); }
          res.redirect('/admin/players');
          console.log('player added: ' + player.name);
        })
      }
    })
  }
};
