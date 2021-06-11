const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


(async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({headless: true, channel: 'chrome'});
  const page = await browser.newPage();
  await page.goto('https://www.dhlottery.co.kr/user.do?method=login', {waitUntil: 'networkidle2', timeout: 5000});
  await page.waitForSelector('[name="userId"]');
  await page.type('[name="userId"]', process.env.MY_ID);
  await page.keyboard.down('Tab');
  await page.keyboard.type(process.env.MY_PW);
  await page.evaluate((id, pw) => {
		check_if_Valid3();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
//  await Promise.all([
// 	 page.evaluate((id, pw) => {
//		check_if_Valid3();
//	 }),
//          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }),
//	]);
  console.log(await page.content());
  await browser.close();
})();
