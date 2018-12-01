var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wasedadb'
});

var initial = 10000
var max = initial + 5000

for (var i=initial; i<max; i++) {
  setTimeout( function(i) {
    query = "SELECT * FROM wasedadb.courses WHERE `dataIndex`=\""+i+"\"";
    connection.query(query, function (err, results, fields) {
      if (err) throw err 
      if (results.length != 1) {
        console.log(i);
      }
      if(i==3999){
        connection.end();
      }
    });
  }, (i-initial)*10, i);
}