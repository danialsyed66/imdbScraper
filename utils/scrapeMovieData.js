const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function (movies) {
  try {
    const { data } = await axios.get(
      'https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm'
    );
    const $ = await cheerio.load(data);

    const d = Date.now();
    $('tbody > tr').each((i, row) => {
      const movie = {};

      const [_, titleColumn, ratingColumn] = $(row).children();

      const a = $(titleColumn).find('a');
      movie.title = a.text();
      movie.descriptionUrl = 'https://www.imdb.com' + a.attr('href');
      movie.year = parseInt($(titleColumn).find('span').text().slice(1));
      movie.rank = parseInt($(titleColumn).find('div').text());

      movie.rating = +$(ratingColumn).find('strong').text();

      movies.push(movie);
    });
  } catch (err) {
    console.log('scrapeMovieData');
    console.log(err);
  }
};
