var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TournamentSchema = Schema(
  {
    par: { type: Number },
    round: { type: String }
  }
)

module.exports = mongoose.model('Tournament', TournamentSchema);
