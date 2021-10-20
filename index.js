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
  // const interval = 15;
  // for (let i = 0; i <= 100; i += interval) {
  //   if ((interval - (100 - i)) * -1 < 5) {
  //     await scrapePosterUrls(movies.slice(i), startTime, sum);
  //     break;
  //   }
  //   await scrapePosterUrls(movies.slice(i, i + interval), startTime, sum);
  // }
  // await scrapePosterUrls(movies.slice(0, 2), startTime, sum);
  sum.sum = 0;
  // await scrapePosterUrls(movies, startTime, sum);
  // await scrapePosterImgSrcs(movies, startTime, sum);
  // await scrapePosterImgSrcs(movies.slice(0, 2), startTime, sum);

  // console.log(movies);
  // fs.writeFileSync(
  //   './movies.json',
  //   JSON.stringify({
  //     results: movies.length,
  //     data: {
  //       movies: movies.slice(0, 2),
  //     },
  //   })
  // );
  const endTime = Date.now();
  await Movie.deleteMany();
  await Movie.create(movies);
  await Log.create({
    startTime,
    endTime,
    urlsTime: Date.now(),
    srcTime: Date.now(),
    totalTime: endTime - startTime,
  });
  console.log('DONE', Date.now() - startTime);
};

main();
