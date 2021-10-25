const puppeteer = require('puppeteer');

module.exports = async function (movies, d, sum) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  for (let i = 0; i < movies.length; i++) {
    try {
      if (movies[i].posterUrl) {
        await page.goto(movies[i].posterUrl);
        movies[i].imgSrc = await page.evaluate(() =>
          document
            .querySelector(
              '#__next > main > div.ipc-page-content-container.ipc-page-content-container--full.BaseLayout__NextPageContentContainer-sc-180q5jf-0.fWxmdE > div.styles__MediaViewerContainerNoNav-sc-6t1jw8-1.hbiiqm.media-viewer > div:nth-child(4) > img'
            )
            .getAttribute('src')
        );
      }
      console.log(++sum.sum, Date.now() - d);
    } catch (err) {
      console.log('scrapePosterImgSrcs');
      console.log(err);
    }
  }
  await browser.close();
};
