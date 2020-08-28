var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.use('/jsonData', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(logs())
});


function logs() {
  var data = fs.readFileSync('performanceTesting.json');
  var lines = data.toString().split(';');
  var jsonTemp = {
    requestData:[],
    documentData:[]
  }
  lines.forEach(element => {
    jsonTemp.requestData.push(element)
  });
  data = fs.readFileSync('documentTesting.json');
  lines = data.toString().split(';');
  lines.forEach(element => {
    jsonTemp.documentData.push(element)
  });
  return jsonTemp
}
module.exports = router;