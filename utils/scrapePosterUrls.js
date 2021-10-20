const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function (movies, d, sum) {
  try {
    await Promise.allSettled(
      movies.map(async movie => {
        const { data } = await axios.get(movie.descriptionUrl, {
          timeout: 120000,
        });
        if (!data) return movie;
        const $ = await cheerio.load(data);
        const url = $(
          'div.Media__PosterContainer-sc-1x98dcb-1.dGdktI > div > a'
        ).attr('href');
        movie.posterUrl = url && 'https://www.imdb.com' + url;
        console.log(++sum.sum, Date.now() - d);
        return movie;
      })
    );
  } catch (err) {
    console.log('scrapePosterUrls');
    console.log(err);
  }
};
