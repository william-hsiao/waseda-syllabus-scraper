var request = require('request'),
  bodyParser = require('body-parser'),
  cheerio = require('cheerio');

var data = [];

console.log(JSON.stringify("asdf'asdfasdf"));
console.log("asdfasdf");

// request('https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=1200007B110120181200007B1112&pLng=en', function(err, res, html){
//   var $ = cheerio.load(res.body, {
//     decodeEntities: false
//   });
//   console.log($('#cEdit').html().split('\n'));
//   //console.log($('#cEdit').html());
//   data.push({'key': '1200007B110120181200007B1112', 'html': $('#cEdit').html()});
// });



// setTimeout(function() {
//   console.log(JSON);
// }, 3000);