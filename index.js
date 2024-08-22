import puppeteer, { KnownDevices } from 'puppeteer';
import { PAGE_URL } from './constant.js';

// 设备类型
const iPhone15 = KnownDevices['iPhone 15 Pro'];

const browser = await puppeteer.launch({
  headless: false,
  devtools: true,
});
const page = await browser.newPage();
await page.emulate(iPhone15);


// await page.setRequestInterception(true);

// page.on('request', interceptedRequest => {
//   const url = interceptedRequest.url();
//   if (interceptedRequest.isInterceptResolutionHandled()) { return; }
//   if (1) {
//     console.log(url);
//     interceptedRequest.abort();
//   }
//   else {
//     interceptedRequest.continue();
//   }
// });

await page.goto(PAGE_URL);

await page.locator('#fm-login-id').fill('17601026657');
await page.locator('.fm-login-password').fill();


await page.screenshot({
  path: 'hn.png',
});

// await page.close();