import puppeteer from 'puppeteer';

const sleep = (n = 3000) => new Promise(res => setTimeout(res, n));

const browser = await puppeteer.launch({
  headless: false,
});

const page = await browser.newPage();

await page.setViewport({ width: 1280, height: 720 });

await page.goto('https://www.baidu.com');

await page.locator('#kw').fill('正泰集团');
await page.locator('#su').click();

await sleep();

await page.screenshot({
  path: 'baidu.png',
});
// 上传OSS

await sleep();

await page.close();