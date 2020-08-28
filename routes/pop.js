var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
const puppeteer = require('puppeteer');
const {
  response
} = require('express');
var i = 0;
var url = "http://localhost:8080/#/"; //初始url

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
    fs.appendFile('./performanceTesting.json', data, 'utf8', function (err, ret) {})
  }

  const page = await brower.newPage()
  page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.tracing.start({
    path: 'trace.json'
  });
  // 创建一个文件
  let fd = fs.openSync('performanceTesting.json', 'w');
  fs.writeFileSync(fd, new Date() + ";准备进入首页登陆;\n");
  await page.setDefaultNavigationTimeout(0);
  // 进入地址
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });
  wFs(new Date() + ";进入首页;\n")

  await page.type('[placeholder=请输入用户名]', 'ceshi', {
    delay: 0
  })
  await page.type('[placeholder=请输入密码]', '123456', {
    delay: 0
  })
  wFs(new Date() + ";开始登陆;\n")
  const response = await Promise.all([
    page.waitForNavigation({
      waitUntil: "networkidle0"
    }),
    page.click('#login'), // 点击该链接将间接导致导航(跳转)
  ]);
  wFs(new Date() + ";登陆成功;\n")
  await page.waitForSelector('.el-submenu__title')
  const [button] = await page.$x('//span[contains(text(), "系统管理")]')
  await button.click()
  const [menuChild] = await page.$x('//span[contains(text(), "角色管理")]')
  await menuChild.click()
  // let fdd = fs.openSync('atxt.json', 'w')
  wFs(new Date() + ";开始角色管理首页请求;\n")
  const result = await Promise.all([
    page.waitForResponse('http://192.168.1.82:8087/Sys/getRoleList'),
    page.waitForResponse('http://192.168.1.82:8087/Sys/getRoleType'),
    page.waitForResponse('http://192.168.1.82:8087/Sys/GetMenubutton'),
    page.waitForResponse('http://192.168.1.82:8087/Sys/Get_Sys_Menu_btn')
  ]);
  page.on('response', response => {
    const req = response.request()
    let message = response.text()
    message.then(function (result) {
      fs.appendFile('./atxt.json', JSON.stringify({
        'Response的请求地址：': req.url(),
        '请求方式是：': req.method(),
        '请求body：': unescape(req.postData()),
        '请求返回的状态': response.status(),
        '返回的数据：': result,
      }), 'utf8', function (err, ret) { })
    })
  })

  wFs(new Date() + ";结束角色管理首页请求;\n")
  wFs(new Date() + ";跳入洪水系统;\n")
  await page.goto('http://localhost:8080/#/floodIndex', {
    waitUntil: 'domcontentloaded'
  });
  wFs(new Date() + ";等待渲染完成;\n")
  // const yubaoB = await page.$('.el-button')
  await page.waitForXPath('//button/span[contains(text(),"作业预报")]')
  const [buttonBB] = await page.$x('//button/span[contains(text(),"作业预报")]')
  wFs(new Date() + ";准备进入单站预报页面;\n")
  await buttonBB.click()

  wFs(new Date() + ";开始单站预报页面页请求;\n")
  const results = await Promise.all([
    page.waitForResponse('http://192.168.1.82:8087/Sys/GetMenubutton'),
    page.waitForResponse('http://192.168.1.82:8087/Forecast/GetPredictionTree'),
    page.waitForResponse('http://192.168.1.82:8087/Forecast/GetPlanForPlid'),
    page.waitForResponse('http://192.168.1.82:8087/Forecast/GetPredictionInputAll')
  ]);
  wFs(new Date() + ";结束单站预报页请求;\n")
  page.on('response', response => {
    const req = response.request()
    let message = response.text()
    message.then(function (result) {
      fs.appendFile('./atxt.json', JSON.stringify({
        'Response的请求地址：': req.url(),
        '请求方式是：': req.method(),
        '请求body：': unescape(req.postData()),
        '请求返回的状态': response.status(),
        '返回的数据：': result,
      }), 'utf8', function (err, ret) { })
    })
  })
  await page.tracing.stop();
}