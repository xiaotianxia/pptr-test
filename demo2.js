import puppeteer, { KnownDevices } from 'puppeteer';

// 设备类型
const iPhone15 = KnownDevices['iPhone 15 Pro'];

const browser = await puppeteer.launch({
  headless: false,
  devtools: true,
  // 用户数据保存的位置
  userDataDir: '.pptr-data', 
});
const page = await browser.newPage();
await page.emulate(iPhone15);

await page.goto('https://market.m.taobao.com/app/trip/rx-order-list-new/pages/index');