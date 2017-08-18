var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = Schema(
  {
    name: { type: String, required: true, max: 100 },
    golfer1: { type: String },
    golfer2: { type: String },
    golfer3: { type: String },
    score: { type: Number },
    par1: { type: String },
    par2: { type: String },
    par3: { type: String },
    par4: { type: String }
  }
)

module.exports = mongoose.model('Player', PlayerSchema);
