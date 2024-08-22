import puppeteer, { KnownDevices } from 'puppeteer';

// 设备类型
const iPhone15 = KnownDevices['iPhone 15 Pro'];

async function autoScroll(page, distance = 100, toScrollHeight = 120000) {
  await page.evaluate(async ({ distance, toScrollHeight }) => {
    await new Promise((resolve) => {
      try {
        var totalHeight = 0;
        var timer = setInterval(([distanceTime, toScrollHeightTime]) => {
          const scrollView = document.querySelector('.order-list-scrollview');
          var scrollHeight = scrollView.scrollHeight;
          scrollView.scrollBy(0, distanceTime);
          totalHeight += distanceTime;
          
          if (totalHeight >= scrollHeight || totalHeight > toScrollHeightTime) {
            clearInterval(timer);
            resolve();
          }
        }, 100, [distance, toScrollHeight]);
      } catch (err) {
        console.log('--------出错了', err);
      }
    });
  }, { distance, toScrollHeight });
};


const browser = await puppeteer.launch({
  headless: false,
  devtools: true,
  // 用户数据保存的位置
  userDataDir: '.pptr-data', 
});
const page = await browser.newPage();
await page.emulate(iPhone15);

await page.goto('https://market.m.taobao.com/app/trip/rx-order-list-new/pages/index');

await autoScroll(page, 80, 50 * 1000);
