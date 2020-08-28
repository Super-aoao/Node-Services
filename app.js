var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var logsRouter = require('./routes/logs');
var popRouter = require('./routes/pop');
var page1 = require('./routes/waterSysteam/page1');
var ffms1 = require('./routes/ffms/ffms1');
var senJson = require('./routes/sendJson');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pop', popRouter);
app.use('/logs', logsRouter);
app.use('/page1', page1);
app.use('/ffms1', ffms1);
app.use('/json', senJson);


app.all('*', function (req, res, next) {
  console.log('000')
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With');
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  //可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。
  res.header('Access-Control-Max-Age', 1728000); //预请求缓存20天
  res.status(200)
  next();
});
// app.get('/jsons', function (req, res) {
//   console.log('666')
//   res.status(200).json({
//     success: true,
//     msg: '',
//     obj: '2'
//   })
// });
// app.options('*', function (req, res) {
//   res.setHeader('Access-Control-Allow-Origin', 'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With');
//   res.status(200).json()
//   next()
// });
app.post('/login', function (req, res) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    success: true,
    msg: '',
    obj: '2'
  })
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.env.PORT = 3030;

module.exports = app;

var debug = require('debug')('my-application'); // debug模块
// app.set('port', process.env.PORT || 3030); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
});