var express = require('express');
var router = express.Router();
var fs = require('fs');
const puppeteer = require('puppeteer');
const {
  response
} = require('../../app');
var i = 0;
var url = "http://localhost:8080/#/"; //初始url
let toTime = null
let endTime = null

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send();
  fetchPage(url)
});

module.exports = router;
var delay = 1000;

async function fetchPage(x) {
  const brower = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/TSBrowser/TSBrowser.exe', //指定chromium浏览器位置;
    headless: false, //默认为true 表示不打开浏览器展示;
  })

  // 文件追加
  function wFs(data) {
    fs.appendFile('./performanceTesting.json', JSON.stringify(data) + ';', 'utf8', function (err, ret) {})
  }

  function wFsDocument(data) {
    fs.appendFile('./documentTesting.json', JSON.stringify(data) + ';', 'utf8', function (err, ret) {})
  }

  // await page.tracing.start({ path: 'trace.json' });
  // 创建一个文件
  let fd = fs.openSync('performanceTesting.json', 'w');
  fs.openSync('documentTesting.json', 'w');
  const page = await brower.newPage()
  page.setViewport({
    width: 1920,
    height: 1080
  })
  // 进入地址
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });
  toTime = new Date().getTime()
  let mesTemp = null
  page.on('request', request => {
    if (request.url().length < 100)
      wFs({
        url: request.url(),
        resType: 1,
        Time: new Date().getTime()
      })
  })

  page.on('requestfinished', request => {
    if (request.url().length < 100)
      wFs({
        url: request.url(),
        resType: 3,
        Time: new Date().getTime()
      })
  })
  page.on('response', response => {
    if (response.url().length < 100)
      wFs({
        url: response.url(),
        resType: 2,
        Time: new Date().getTime()
      })
    // if (response._url === 'http://localhost/dev-api/system/user/getInfo') {
    //   response.text().then(function (res) {
    //     mesTemp = JSON.parse(res).code
    //     if (mesTemp === 200) {
    //       go1()
    //     }
    //   })
    // }
  })

  page.on('dialog', async () => {
    console.log(page.url())
  })

  await page.waitForSelector('[placeholder=请输入用户名]')
  endTime = new Date().getTime()
  wFsDocument({
    name: '首屏加载时间',
    time: endTime - toTime
  })
  await page.type('[placeholder=请输入用户名]', 'chifeng', {
    delay: 0
  })
  await page.type('[placeholder=请输入密码]', 'chifeng', {
    delay: 0
  })
  await Promise.all([
    page.waitForNavigation({
      waitUntil: "networkidle0"
    }),
    page.click('#login'), // 点击该链接将间接导致导航(跳转)
    toTime = new Date().getTime()
  ]);
  endTime = new Date().getTime()
  wFsDocument({
    name: '登录到首页加载完成',
    time: endTime - toTime
  })
  await page.waitFor(2000)
  await page.goto('http://localhost:8080/#/floodIndex', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForXPath('//button/span[contains(text(),"作业预报")]')
  const [buttonBB] = await page.$x('//button/span[contains(text(),"作业预报")]')
  await page.waitFor(1000)
  await buttonBB.click()
  toTime = new Date().getTime()
  await Promise.all([
    page.waitForResponse('http://192.168.1.82:8087/Sys/GetMenubutton'),
    page.waitForResponse('http://192.168.1.82:8087/Forecast/GetPredictionTree'),
    page.waitForResponse('http://192.168.1.82:8087/Forecast/GetPlanForPlid'),
    page.waitForResponse('http://192.168.1.82:8087/Forecast/GetPredictionInputAll')
  ]);
  endTime = new Date().getTime()
  wFsDocument({
    name: '单站预报页面请求完成成功',
    time: endTime - toTime
  })
  //   await page.waitForSelector('.el-submenu__title')
  //   const [button] = await page.$x('//span[contains(text(), "系统管理")]')
  //   await button.click()
  //   const [menuChild] = await page.$x('//span[contains(text(), "角色管理")]')
  //   await menuChild.click()
}