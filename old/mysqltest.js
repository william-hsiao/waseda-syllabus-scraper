var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wasedadb'
});

var title = 'Title';
var query = "INSERT INTO courses (syllabusKey, courseTitle) VALUES (3, '"+title+"')"
connection.connect();


// connection.query('CREATE TABLE test (name VARCHAR(32))', function (err) {
//   if (err) throw err;
//   console.log('added table');
// });


connection.query(query, function (err) {
  if (err) throw err;
  console.log('added entry');
});

connection.end();