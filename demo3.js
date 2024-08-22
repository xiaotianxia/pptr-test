import puppeteer, { KnownDevices } from 'puppeteer';

// 设备类型
const iPhone15 = KnownDevices['iPhone 15 Pro'];

async function autoScroll(page, distance = 100, toScrollHeight = 120000) {
  return await page.evaluate(async ({ distance, toScrollHeight }) => {
    return await new Promise((resolve) => {
      try {
        var totalHeight = 0;
        var timer = setInterval(([distanceTime, toScrollHeightTime]) => {
          const scrollView = document.querySelector('.order-list-scrollview');
          var scrollHeight = scrollView.scrollHeight;
          scrollView.scrollBy(0, distanceTime);
          totalHeight += distanceTime;

          console.log('-----totalHeight', totalHeight);
          
          if (totalHeight >= scrollHeight || totalHeight > toScrollHeightTime) {
            clearInterval(timer);
            resolve(totalHeight);
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

const height = await autoScroll(page, 80, 50 * 1000);
console.log(height);
