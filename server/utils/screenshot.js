const puppeteer = require('puppeteer');

async function takeScreenshot(imagePath, { selector = 'body', url = 'about:blank' } = {}) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      timeout: 2000,
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    const elem = await page.$(selector);
    await elem.screenshot({
      path: imagePath,
    });
  } finally {
    if (browser && browser.close) {
      browser.close();
    }
  }
}

module.exports = {
  takeScreenshot,
};
