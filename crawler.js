var casper = require('casper').create({
  verbose: true,
  logLevel: "debug"
});
var fs = require('fs');

function scrape () {
  this.echo('Scraping');
  if (pageNum != 'undefined') {
    this.then(function() {
      data = this.getElementsInfo('a');
      for (i = 0; i < data.length-3; i++){
        if (data[i].attributes.onclick.indexOf("post_submit") == 0) {
          content = data[i].attributes.onclick.split("'")[3];
          this.echo(content);
          // fs.write("keys.txt", content+"\n", 'a');
        }
        if (data[i].attributes.onclick.indexOf("page_turning") == 0) {
          pageNum = String(data[i].attributes.onclick.split("'")[3]);
        }
      }

      this.echo("PageNum = " + pageNum);
      this.evaluate(function (page) {
        page_turning('JAA103SubCon', page)
      }, pageNum)
    });
    // this.then(scrape);
  }
};

casper.start('https://www.wsl.waseda.jp/syllabus/JAA101.php?pLng=en', function () {
  pageNum = 1;
})
.thenClick('#p_bunya1')
.thenClick('#big_select_all')
.thenClick('input.button01[name="btnSubmit"]')
.thenEvaluate(function () {
  func_showchg('JAA103SubCon', '100');
});

casper.then(scrape);
casper.run();
