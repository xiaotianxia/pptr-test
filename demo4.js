import puppeteer, { KnownDevices } from 'puppeteer';
import mockData from './data/1.js';

// 设备类型
const iPhone15 = KnownDevices['iPhone 15 Pro'];

const sleep = (n = 3) => new Promise(res => setTimeout(res, n * 1000));


const  autoScroll = async (page, distance = 100, toScrollHeight = 120000) => {
  await page.evaluate(async ({ distance, toScrollHeight }) => {
    await new Promise((resolve) => {
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
  
  if (req.resourceType() === 'xhr' && url.includes('mtop.fliggy.trade.item.buildOrder')) {
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
  'https://market.m.taobao.com/app/trip/rx-buy/pages/confirm?_fli_webview=true&ttidable=true&_fli_online=true&fpt=ftuid(pvdCroOy1724297225676.6)sku(0)vac(detail)&categoryId=50794037&disableNav=YES&titleBarHidden=2&ttid=12mtb000010951&spm=181.7850105.skuFloat.new_buy&spmUrl=181.7437892.standard.hotelRoom&utparam=%257B%2522page_item_id%2522%253A825367424453%252C%2522page_category_id%2522%253A%252250794037%2522%257D&itemId=825367424453&skuId=5542863192115&quantity=1&buyNow=true&bizType=trip&exParams=%7B%22verticalBuyParam%22%3A%5B%7B%22buyAmount%22%3A1%2C%22quantity%22%3A1%2C%22skuId%22%3A5542863192115%2C%22itemId%22%3A825367424453%2C%22categoryId%22%3A%2250794037%22%7D%5D%7D&pre_pageVersion=2.2.17&_projVer=2.0.119',
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
  path: './screenshot/1.png',
  fullPage: true,
});

await sleep(1);

await browser.close();