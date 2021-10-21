const fs = require('fs');
const mongoose = require('mongoose');

const scrapeMovieData = require('./utils/scrapeMovieData');
const scrapePosterUrls = require('./utils/scrapePosterUrls');
const scrapePosterImgSrcs = require('./utils/scrapePosterImgSrcs');

const Movie = require('./models/movieModel');
const Log = require('./models/logModel');

const main = async function () {
  await mongoose
    .connect(
      'mongodb+srv://danialsyed66:5nnv@U3!ESdtXCz@cluster0.2wfch.mongodb.net/imdbScraperDB?retryWrites=true&w=majority',
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

  const movies = [];
  const startTime = Date.now();
  await scrapeMovieData(movies);

  console.log(Date.now() - startTime);

  const sum = { sum: 0 };

  const urlsStart = Date.now();
  await scrapePosterUrls(movies, startTime, sum);
  const urlsTime = Date.now() - urlsStart;

  sum.sum = 0;

  const srcsStart = Date.now();
  await scrapePosterImgSrcs(movies, startTime, sum);
  const srcTime = Date.now() - srcsStart;

  const endTime = Date.now();
  await Movie.deleteMany();
  await Movie.create(movies);
  await Log.create({
    startTime,
    endTime,
    urlsTime,
    srcTime,
    totalTime: endTime - startTime,
  });
  console.log('DONE', Date.now() - startTime);
};

main();
