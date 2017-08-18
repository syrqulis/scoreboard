var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GolferSchema = Schema(
  {
    name: { type: String, required: true, max: 100 },
    round1: { type: String },
    round2: { type: String },
    round3: { type: String },
    round4: { type: String },
    total: { type: String },
    parAfter1: { type: Number },
    parAfter2: { type: Number },
    parAfter3: { type: Number },
    par: { type: String }
  }
)

module.exports = mongoose.model('Golfer', GolferSchema);
