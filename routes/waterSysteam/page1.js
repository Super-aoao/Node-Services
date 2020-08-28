var express = require('express');
var router = express.Router();
var fs = require('fs');
const puppeteer = require('puppeteer');
const {
  response
} = require('../../app');
var i = 0;
var url = "http://localhost/login?redirect=%2Findex"; //初始url
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

  // 等待时间
  function timeout(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(1)
        } catch (e) {
          reject(0)
        }
      }, delay)
    })
  }


  // 文件追加
  function wFs(data) {
    fs.appendFile('./requestCheck.json', JSON.stringify(data), 'utf8', function (err, ret) {})
  }

  // await page.tracing.start({ path: 'trace.json' });
  // 创建一个文件
  let fd = fs.openSync('requestCheck.json', 'w');
  const page = await brower.newPage()
  page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.setDefaultNavigationTimeout(0);
  // 进入地址
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });

  let mesTemp = null
  page.on('request', request => {
    wFs({
      url: request.url(),
      requestTime: new Date().getTime()
    })
  })

  page.on('requestfinished', request => {
    wFs({
      url: request.url(),
      requestfinishedTime: new Date().getTime()
    })
  })
  page.on('response', response => {
    wFs({
      url: response.url(),
      responseTime: new Date().getTime()
    })
    if (response._url === 'http://localhost/dev-api/system/user/getInfo') {
      response.text().then(function (res) {
        mesTemp = JSON.parse(res).code
        if (mesTemp === 200) {
          go1()
        }
      })
    }
  })

  async function go1() {
    await page.waitForSelector('.el-submenu__title')
    const [elMenu] = await page.$x('//span[contains(text(),"系统管理")]')
    await elMenu.click()
    await page.waitFor(1000)
    const [userMenu] = await page.$x('//span[contains(text(),"角色管理")]')
    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle0"
      }),
      userMenu.click(), // 点击该链接将间接导致导航(跳转)
      toTime = new Date().getTime()
    ]);
    endTime = new Date().getTime()
    console.log('角色管理', endTime - toTime)

    // 部门管理
    await page.waitFor(5000)
    const [uMenu] = await page.$x('//span[contains(text(),"部门管理")]')
    await Promise.all([
      page.waitForNavigation({
        waitUntil: "domcontentloaded"
      }),
      uMenu.click(), // 点击该链接将间接导致导航(跳转)
      toTime = new Date().getTime()
    ]);
    console.log(new Date().getTime())
    endTime = new Date().getTime()
    console.log('部门管理', endTime - toTime)
  }
}

async function inner() {
  await page.goto('https://www.baidu.com')
}