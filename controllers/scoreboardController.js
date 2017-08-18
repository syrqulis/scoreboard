var async = require('async');
var request = require("request");
var cheerio = require("cheerio");
var _ = require('underscore');

var Player = require('../models/player');
var Golfer = require('../models/golfer');
var Tournament = require('../models/tournament');

exports.create_get = function(req, res){
  async.waterfall(
    [
      function(callback)
      {
        Golfer.find({}).exec(function (err, golfers)
        {
          callback(null, golfers);
        });
      },
      function(golfers, callback)
      {
        Player.find({}).exec(function (err, players)
        {
          callback(null, players, golfers);
        });
      },
      function(players, golfers, callback)
      {
        Tournament.find({}).exec(function (err, tournament)
        {
          callback(null, tournament, players, golfers);
        });
      }
    ],
    function (err, tournament, players, golfers)
    {
      var round = tournament[0].round;
      var par = tournament[0].par;
      var playerList = new Array;
      var highScore =
      {
        two: 0,
        three: 0,
        four: 0
      }
      console.log(round, par);
      if (round.startsWith('Round') && round.endsWith('In Progress'))
      {
        if (!(parseInt(round.substr(6)) === 1))
        {
          round = parseInt(round.substr(6)) - 1;
        }
        else
        {
          round = parseInt(round.substr(6));
        }
      }
      else
      {
        round = 5;
      }

      for (i = 0; i < golfers.length; i++)
      {
        if (highScore.two < (parseInt(golfers[i].round1) + parseInt(golfers[i].round2) - par*2) && (golfers[i].par != 'CUT'))
        {
          highScore.two = parseInt(golfers[i].round1) + parseInt(golfers[i].round2) - par*2;
        }
        if (highScore.three < (parseInt(golfers[i].round1) + parseInt(golfers[i].round2) + parseInt(golfers[i].round3) - par*3) && ( golfers[i].par != 'CUT'))
        {
          highScore.three = parseInt(golfers[i].round1) + parseInt(golfers[i].round2) + parseInt(golfers[i].round3) - par*3;
        }
        if (highScore.four < (parseInt(golfers[i].round1) + parseInt(golfers[i].round2) + parseInt(golfers[i].round3) + parseInt(golfers[i].round4) - par*4) && ( golfers[i].par != 'CUT'))
        {
          highScore.four = parseInt(golfers[i].round1) + parseInt(golfers[i].round2) + parseInt(golfers[i].round3) + parseInt(golfers[i].round4) - par*4;
        }
      }

      for (i = 0; i < golfers.length; i++)
      {
        switch (round)
        {
          case 1: golfers[i].parAfter1 = parseInt(golfers[i].round1) - par; break;
          case 2:
            if (golfers[i].par === 'CUT' || golfers[i].par === 'WD')
            {
              golfers[i].parAfter2 = highScore.two + 1;
            }
            else
            {
              golfers[i].parAfter2 = parseInt(golfers[i].round1) + parseInt(golfers[i].round2) - par*2;
            }
            break;
          case 3:
            if (golfers[i].par === 'CUT' || golfers[i].par === 'WD')
            {
              golfers[i].parAfter3 =  highScore.three + 1;
            }
            else
            {
              golfers[i].parAfter3 = parseInt(golfers[i].round1) + parseInt(golfers[i].round2) + parseInt(golfers[i].round3) - par*3;
            }
            break;
          case 4:
            if (golfers[i].par === 'CUT' || golfers[i].par === 'WD')
            {
              golfers[i].parAfter4 = highScore.four + 1;
            }
            else
            {
              golfers[i].parAfter4 = parseInt(golfers[i].round1) + parseInt(golfers[i].round2) + parseInt(golfers[i].round3) + parseInt(golfers[i].round4) - par*4;
            }
            break;
          case 5:
            if (golfers[i].par === 'CUT' || golfers[i].par === 'WD')
            {
              golfers[i].par = highScore.four + 1;
            }
            else if (golfers[i].par === 'E')
            {
              golfers[i].par = 0;
            }
            else
            {
              golfers[i].par = parseInt(golfers[i].par);
            }
        }
      }

      if (err) { console.log(err) }
      else
      {
        for (i = 0; i < players.length; i++)
        {
          players[i].score = 0;

          for (j = 0; j < golfers.length; j++)
          {
            if (round === 1){
                if (players[i].golfer1 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter1) + players[i].score }
                if (players[i].golfer2 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter1) + players[i].score }
                if (players[i].golfer3 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter1) + players[i].score }
            }
            if (round === 2){
                if (players[i].golfer1 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter2) + players[i].score }
                if (players[i].golfer2 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter2) + players[i].score }
                if (players[i].golfer3 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter2) + players[i].score }
            }
            if (round === 3){
                if (players[i].golfer1 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter3) + players[i].score }
                if (players[i].golfer2 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter3) + players[i].score }
                if (players[i].golfer3 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter3) + players[i].score }
            }
            if (round === 4){
                if (players[i].golfer1 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter4) + players[i].score }
                if (players[i].golfer2 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter4) + players[i].score }
                if (players[i].golfer3 === golfers[j].name) { players[i].score = parseInt(golfers[j].parAfter4) + players[i].score }
            }
            if (round === 5){
                if (players[i].golfer1 === golfers[j].name) { players[i].score = parseInt(golfers[j].par) + players[i].score }
                if (players[i].golfer2 === golfers[j].name) { players[i].score = parseInt(golfers[j].par) + players[i].score }
                if (players[i].golfer3 === golfers[j].name) { players[i].score = parseInt(golfers[j].par) + players[i].score }
            }
          }

          var newPlayer =
          {
            name: players[i].name,
            golfer1: players[i].golfer1,
            golfer2: players[i].golfer2,
            golfer3: players[i].golfer3,
            score: players[i].score
          }
          playerList.push(newPlayer);
          playerList = _.sortBy(playerList, 'score');
          Player.findOneAndUpdate({ "name": newPlayer.name }, newPlayer, { upsert: false }, function(err, doc)
          {
            if (err) throw err;
          })
        }
      }
      res.render('scoreboard', { title: 'Scoreboard', players: playerList });
    }
  )
};

exports.create_post = function(req, res){
  res.send('NOT IMPLEMENTED');
}


/* */
