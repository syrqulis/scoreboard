var Golfer = require('../models/golfer');
var Tournament = require('../models/tournament');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.espn.com/golf/leaderboard';

var golfers = [];

exports.create_get = function(req, res){
  res.render('golfer', { title: 'Golfers' });
};

exports.create_post = function(req, res){
  async.waterfall(
    [
      function (callback)
      {
        var scoreboard = new Array();
        request(url, function (error, response, body)
        {
          if (!error)
          {
            var $ = cheerio.load(body);
            $('.full-name').each(function(i, elem)
            {
              var temp =
              {
                "name" : $(this).text(),
                "round1" : $(this).parent().next().next().next().next().text(),
                "round2" : $(this).parent().next().next().next().next().next().text(),
                "round3" : $(this).parent().next().next().next().next().next().next().text(),
                "round4" : $(this).parent().next().next().next().next().next().next().next().text(),
                "total" : $(this).parent().next().next().next().next().next().next().next().next().text(),
                "par" : $(this).parent().next().text()
              }
              scoreboard.push(temp);

            })
            var par = $('.matchup-detail').find('.type').first().text();
            par = parseInt(par.substr(4));
            var tinfo =
            {
              par: par,
              round: $('.tournament-status').text()
            }
            callback(null, scoreboard, tinfo);
          }
            else
          {
            console.log("We’ve encountered an error: " + error);
          }
        });
      },
      function (arg1, arg2, callback)
      {
        Tournament.remove({}, function(err){ if (err) { return console.log(err) }})
        var tournament = new Tournament
        ({
          par: arg2.par,
          round: arg2.round
        })
        tournament.save(function (err)
        {
          if (err) { return console.log(err) }
        })
        callback(null, arg1);
      },
      function (arg1, callback)
      {
        Golfer.remove({}, function(err){ if (err) { return console.log(err) }})

        for (i = 0; i < arg1.length; i++)
        {
          var golfer = new Golfer
          ({
            name: arg1[i].name,
            round1: parseInt(arg1[i].round1),
            round2: parseInt(arg1[i].round2),
            round3: parseInt(arg1[i].round3),
            round4: parseInt(arg1[i].round4),
            total: parseInt(arg1[i].total),
            parAfter1: 0,
            parAfter2: 0,
            parAfter3: 0,
            parAfter4: 0,
            par: arg1[i].par
          })

          golfer.save(function (err)
          {
            if (err) { return console.log(err) }
          })
        }
        callback(null, arg1)
      }
    ],
    function (err, arg1)
    {
      if (err) { console.log(err) }
      else
      {
        var count = arg1.length;
        res.render('golfer', { title: 'Golfers', notadded: 'Database updated', result: count })
      }
    }
  )
};

exports.delete_get = function(req, res){
  res.send('NOT IMPLEMENTED');
};

exports.delete_post = function(req, res){
  res.send('NOT IMPLEMENTED');
};

exports.update_get = function(req, res){
  res.send('NOT IMPLEMENTED');
};

exports.update_post = function(req, res){
  res.send('NOT IMPLEMENTED');
};
