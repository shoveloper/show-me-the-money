const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


(async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({headless: true, channel: 'chrome', args: ['--disable-features=site-per-process']});
  const page = await browser.newPage();

  // Logged in
  await page.goto('https://www.dhlottery.co.kr/user.do?method=login', {waitUntil: 'networkidle2', timeout: 5000});
  await page.waitForSelector('[name="userId"]');
  await page.type('[name="userId"]', process.env.MY_ID);
  await page.keyboard.down('Tab');
  await page.keyboard.type(process.env.MY_PW);
  await page.evaluate(() => {
    check_if_Valid3();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
  console.log('Logged in: OK!');

  // Load game
  await page.goto('https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40', {waitUntil: 'networkidle2', timeout: 5000});
  console.log('Load game: OK!');

  // Select lotto type
  await page.waitForSelector('iframe');
  const elementHandle = await page.$('iframe[src="https://ol.dhlottery.co.kr/olotto/game/game645.do"]');
  const frame = await elementHandle.contentFrame();
  console.log(await frame.content());
  await frame.evaluate(() => {
    selectWayTab(1); return false;
  });
  await frame.waitFor(5000);
  console.log('Select lotto type: OK!');

  // Assign lotto slot
  await frame.waitForSelector('input#btnSelectNum');
  await frame.click('input#btnSelectNum');
  await frame.waitFor(3000);
  console.log('Assign lotto slot: OK!');

  // Click buy button (with confirm)
  await frame.waitForSelector('input#btnBuy');
  page.on('dialog', async dialog => {
    await dialog.accept();
    console.log('Click confirm button: OK!');
  });
  await frame.click('input#btnBuy');
  await frame.waitFor(3000);
  console.log('Click buy button: OK!');

  //console.log(await frame.content());
  await browser.close();
})();
