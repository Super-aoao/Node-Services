var express = require('express');
var router = express.Router();
var fs = require('fs');
var readline = require('readline');
var md5 = require("md5")

router.get('/', function (req, res, next) {
    res.send(logs());

});
module.exports = router;

function logs() {
    var data = fs.readFileSync('xwlogs.log');
    var lines = data.toString().split('\n');
    var rStr = ''
    let md5Str = ''
    var count = '';
    var countAttack = 0;
    var num = 0;
    let fd = fs.openSync('delwithData.log', 'w');

    lines.forEach((element, index) => {
        if (element.includes('塔格') && element.includes('希瓦') && element.includes('|闪耀|')) {
            var attackArr = element.split('|')
            md5Str = ''
            count = ''
            if (attackArr.length < 14) {
                attackArr.forEach((ielement, iindex) => {
                    if (iindex === 9) {
                        ielement = (parseInt(ielement.substring(0, ielement.length - 4), 16) - 2000).toString(16) + '0000';
                        countAttack += 2000
                        // ielement = '18240000'
                    }
                    if (iindex < attackArr.length - 1) {
                        md5Str += ielement + '|'
                    }
                    if (iindex === attackArr.length - 1) {
                        ielement = md5(md5Str + (index + 1))
                    }
                    if (iindex < attackArr.length - 1) {
                        count += ielement + '|'
                    } else if (iindex = attackArr.length - 1) {
                        count += ielement
                    }

                });
            }
            element = count
            // fs.appendFileSync('./delwithData.log', element + '\n', 'utf8', function (err, ret) { })
            // rStr += element + '<br>' + (index + 1) + ';<br>'
        }
    });

    lines.forEach((element, index) => {
        if (element.includes('桜阑') && element.includes('希瓦') && element.includes('|攻击|')) {
            num++
        }
    });


    // console.log(countAttack / num)
    lines.forEach((element, index) => {
        if (element.includes('桜阑') && element.includes('希瓦') && element.includes('|攻击|')) {
            var attackArr = element.split('|')
            md5Str = ''
            count = ''
            attackArr.forEach((ielement, iindex) => {
                if (iindex === 9) {
                    // console.log(parseInt(ielement.substring(0, ielement.length - 4), 16)+'')
                    ielement = (parseInt(ielement.substring(0, ielement.length - 4), 16) + Number((countAttack / num).toFixed(0))).toString(16) + '0000';
                    // ielement = '18240000'
                }
                if (iindex < attackArr.length - 1) {
                    md5Str += ielement + '|'
                }
                if (iindex === attackArr.length - 1) {
                    ielement = md5(md5Str + (index + 1))
                }
                if (iindex < attackArr.length - 1) {
                    count += ielement + '|'
                } else if (iindex = attackArr.length - 1) {
                    count += ielement
                }

            });
            element = count
            // rStr += element + '<br>' + (index + 1) + ';<br>'
            fs.appendFileSync('./delwithData.log', element + '\n', 'utf8', function (err, ret) { })
        }
        rStr += element + '<br>'
    });

    var data = fs.readFileSync('delwithData.log');
    var dataTemp = data.toString().replace('/桜阑/g', '雪之中')
    fs.writeFileSync('./delwithData.log', dataTemp);
    // return parseInt(500).toString(16)
    // return parseInt('500',16)+''
}