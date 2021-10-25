const mongoose = require('mongoose');
const express = require('express');
const cron = require('node-cron');

const scrapeMovieData = require('./utils/scrapeMovieData');
const scrapePosterUrls = require('./utils/scrapePosterUrls');
const scrapePosterImgSrcs = require('./utils/scrapePosterImgSrcs');

const Movie = require('./models/movieModel');
const Log = require('./models/logModel');

const app = express();

app.listen(process.env.PORT || 3000);

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
  const sum = { sum: 0 };
  const startTime = Date.now();
  await scrapeMovieData(movies);

  console.log(Date.now() - startTime);

  await scrapePosterUrls(movies, startTime, sum);
  const urlsTime = Date.now() - startTime;
  console.log(urlsTime, 'Urls Scraped');

  sum.sum = 0;
  const srcStartTime = Date.now();
  await scrapePosterImgSrcs(movies, startTime, sum);
  const srcTime = Date.now() - srcStartTime;
  console.log(srcTime, 'Srcs Scraped');

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

cron.schedule('15 0 * * *', async function () {
  console.log('Running schedule...');
  await main();
});

// main();
