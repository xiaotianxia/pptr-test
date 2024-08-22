import puppeteer, { KnownDevices } from 'puppeteer';
import mockData from './data/3.js';

// 设备类型
const iPhone15 = KnownDevices['iPhone 15 Pro'];

const sleep = (n = 3) => new Promise(res => setTimeout(res, n * 1000));


const  autoScroll = async (page, distance = 100, toScrollHeight = 120000) => {
  return await page.evaluate(async ({ distance, toScrollHeight }) => {
    return await new Promise((resolve) => {
      try {
        var totalHeight = 0;
        var timer = setInterval(([distanceTime, toScrollHeightTime]) => {
          const scrollView = document.querySelector('#buy-phoenix-scrollview');
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
  userDataDir: '.pptr-data', 
  args: [
    // 关闭的同源策略
    '--disable-web-security',
  ],
});


const page = await browser.newPage();
await page.emulate(iPhone15);

// 拦截请求
await page.setRequestInterception(true);
page.on('request', req => {
  const url = req.url();
  if (req.isInterceptResolutionHandled()) { return; }
  
  if (req.resourceType() === 'xhr' && url.includes('mtop.fliggy.trade.hotel.buildOrder')) {
    console.log(url);
    
    req.respond({
      status: 200,
      headers: {
        ...req.headers(),
        'Access-Control-Allow-Origin': '*',
      },
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify(mockData),
    });
  } else {
    req.continue();
  }
});


await page.goto(
  'https://market.m.taobao.com/app/trip/rx-hotel-buy/pages/confirm?bizType=hotel',
  {
    waitUntil: ['load', 'networkidle2'],
  }
);

const height = await autoScroll(page, 80, 50 * 1000);

console.log('----height', height);

await page.setViewport({
  width: 375,
  height: height || 1000,
});

await sleep(1);

await page.screenshot({
  path: `./screenshot/${+new Date()}.png`,
  fullPage: true,
});

await sleep(1);

await browser.close();