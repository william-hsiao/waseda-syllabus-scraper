var fs = require('fs'),
  jsonFormat = require('json-format'),
  request = require('request'),
  bodyParser = require('body-parser'),
  cheerio = require('cheerio');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var keys = require('./masterKeys.txt').split('\n');


var stream = fs.createWriteStream('syllabusRaw1.json');
var errStream = fs.createWriteStream('errors1.txt');
stream.write("[");

//var maxIndex = keys.length;
var iniIndex = 0
var maxIndex = iniIndex+5000

for (var j=iniIndex; j<maxIndex; j++) {

  setTimeout( function (j) {
    request('https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey='+keys[j]+'&pLng=en', function(err, res, html){
      console.log(j);
      if (err) {
        console.log("Error: "+keys[j]+" ========================");
        errStream.write(keys[j]+"\n");
      } else {
        var $ = cheerio.load(res.body, {
          decodeEntities: false
        });

        var content = "{\"key\": " + JSON.stringify(keys[j]) + ", \"html\": " + JSON.stringify($('#cEdit').html()) + "},";
        stream.write(content);

        if (j === maxIndex-1) {
          console.log("Waiting...");
          setTimeout(function() {
            console.log('Finish');
            stream.write("]");
            stream.end();
          }, 30000);
        }
      }
    });
  }, (j-iniIndex)*200, j);
}
