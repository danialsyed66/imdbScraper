const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: String,
  descriptionUrl: String,
  year: Number,
  rank: Number,
  rating: Number,
  posterUrl: String,
  imgSrc: String,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
