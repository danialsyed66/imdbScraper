const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  info: String,
  startTime: Date,
  endTime: Date,
  urlsTime: Number,
  srcTime: Number,
  totalTime: Number,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
