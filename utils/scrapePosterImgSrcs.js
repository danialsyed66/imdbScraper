const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: true });
const nightmare = Nightmare({ show: false });
const Log = require('../models/logModel');

module.exports = async function (movies, d, sum) {
  for (let i = 0; i < movies.length; i++) {
    try {
      if (movies[i].posterUrl) {
        await Log.create({
          info: `IN Src: ${movies[i].posterUrl}`,
        });
        let error;
        movies[i].imgSrc = await nightmare
          .goto(movies[i].posterUrl)
          .wait(
            '#__next > main > div.ipc-page-content-container.ipc-page-content-container--full.BaseLayout__NextPageContentContainer-sc-180q5jf-0.fWxmdE > div.styles__MediaViewerContainerNoNav-sc-6t1jw8-1.hbiiqm.media-viewer > div:nth-child(4) > img'
          )
          .evaluate(async () => {
            await Log.create({
              info: 'IN Srcs evaluate',
            });
            document
              .querySelector(
                '#__next > main > div.ipc-page-content-container.ipc-page-content-container--full.BaseLayout__NextPageContentContainer-sc-180q5jf-0.fWxmdE > div.styles__MediaViewerContainerNoNav-sc-6t1jw8-1.hbiiqm.media-viewer > div:nth-child(4) > img'
              )
              .getAttribute('src');
          })
          .catch(err => {
            error = err;
            console.log(err);
          });
        if (error) {
          await Log.create({
            info: `ERROR IN Src: ${error}`,
          });
        }
      }
      console.log(++sum.sum, Date.now() - d);
    } catch (err) {
      console.log('scrapePosterImgSrcs');
      console.log(err);
    }
  }
};
