var async = require('async');
var request = require("request");
var cheerio = require("cheerio");
var _ = require('underscore');

var Player = require('../models/player');
var Golfer = require('../models/golfer');
var par = 70;
var round = 4;

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
        })
      }
    ],
    function (err, players, golfers)
    {
      var playerList = new Array;
      var highScore =
      {
        round1: 0,
        round2: 0,
        round3: 0,
        round4: 0
      };
      for (i = 0; i < golfers.length; i++)
      {
        if (highScore.round1 < parseInt(golfers[i].round1))
        {
          highScore.round1 = parseInt(golfers[i].round1);
        }
        if (highScore.round2 < parseInt(golfers[i].round2))
        {
          highScore.round2 = parseInt(golfers[i].round2);
        }
        if (highScore.round3 < parseInt(golfers[i].round3))
        {
          highScore.round3 = parseInt(golfers[i].round3);
        }
        if (highScore.round4 < parseInt(golfers[i].round4))
        {
          highScore.round4 = parseInt(golfers[i].round4);
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
            if (players[i].golfer1 == golfers[j].name)
            {
            /*  if (golfers[j].round1 == '--')
              {
                golfers[j].round1 = highScore.round1 + 1;
              }
              if (golfers[j].round2 == '--')
              {
                golfers[j].round2 = highScore.round2 + 1;
              }
              if (golfers[j].round3 == '--')
              {
                golfers[j].round3 = highScore.round3 + 1;
              }
              if (golfers[j].round4 == '--')
              {
                golfers[j].round4 = highScore.round4 + 1;
              }*/
              switch (golfers[j].round4)
              {
                case '--':
                  console.log('yes');
              }
              var roundTotal = parseInt(golfers[j].round1) + parseInt(golfers[j].round2) + parseInt(golfers[j].round3) + parseInt(golfers[j].round4);
              players[i].score = players[i].score + roundTotal;
            }
            if (players[i].golfer2 == golfers[j].name)
            {
              if (golfers[j].round1 === '--')
              {
                golfers[j].round1 = highScore.round1 + 1;
              }
              if (golfers[j].round2 === '--')
              {
                golfers[j].round2 = highScore.round2 + 1;
              }
              if (golfers[j].round3 === '--')
              {
                golfers[j].round3 = highScore.round3 + 1;
              }
              if (golfers[j].round4 === '--')
              {
                golfers[j].round4 = highScore.round4 + 1;
              }
              switch (golfers[j].round4)
              {
                case '--':
                  console.log('yes');
              }
              var roundTotal = parseInt(golfers[j].round1) + parseInt(golfers[j].round2) + parseInt(golfers[j].round3) + parseInt(golfers[j].round4);
              players[i].score = players[i].score + roundTotal;
            }
            if (players[i].golfer3 == golfers[j].name)
            {
              if (golfers[j].round1 == '--')
              {
                golfers[j].round1 = highScore.round1 + 1;
              }
              if (golfers[j].round2 == '--')
              {
                golfers[j].round2 = highScore.round2 + 1;
              }
              if (golfers[j].round3 == '--')
              {
                golfers[j].round3 = highScore.round3 + 1;
              }
              if (golfers[j].round4 == '--')
              {
                golfers[j].round4 = highScore.round4 + 1;
              }
              var roundTotal = parseInt(golfers[j].round1) + parseInt(golfers[j].round2) + parseInt(golfers[j].round3) + parseInt(golfers[j].round4);
              players[i].score = players[i].score + roundTotal;
            }
          }

          var newPlayer =
          {
            name: players[i].name,
            golfer1: players[i].golfer1,
            golfer2: players[i].golfer2,
            golfer3: players[i].golfer3,
            score: players[i].score - (par*3*round)
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
