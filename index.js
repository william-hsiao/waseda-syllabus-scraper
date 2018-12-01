var express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  mysql = require('mysql'),
  app = express(),
  server = http.createServer(app).listen(8088);

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wasedadb'
});

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
console.log("Server running on port 8088");
app.use(function(req, res, next) {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

var buildQuery = function (values) {
  console.log("BuildQuery =====================")
  var flag = 0
  var query = 'SELECT * FROM wasedadb.courses WHERE '
  query += '`courseTitle` LIKE \'%'+values.courseTitle+'%\' AND '
  query += '`year` LIKE \'%'+values.year+'%\' AND '
  query += '`school` LIKE \'%'+values.school+'%\' AND '
  query += '`instructor` LIKE \'%'+values.instructor+'%\' AND '
  query += '`term` LIKE \'%'+values.semester+'%\' AND '
  query += '`day` LIKE \'%'+values.day+'%\' AND '
  query += '`period` LIKE \'%'+values.period+'%\' AND '
  query += '`campus` LIKE \'%'+values.campus+'%\';'
  console.log(query)
  return query
}


app.post('/postclass', function (req, res) {
  var query = buildQuery(req.body);
  connection.query(query, function (err, results, fields){
    if (err) throw err;
    for (i=0; i<results.length; i++) { //Check if class is within the day and period
      if (req.body.day != "") {
        for (j=0; j<results[i].day.split(",").length; j++) {
          if (results[i].day.split(",")[j] == req.body.day) {
            if (req.body.period != "") {
              if (results[i].period.split(",")[j] == req.body.period) break;
            }
            else {
              break;
            }
          }
          if (j==results[i].day.split(",").length-1) {
            results.splice(i,1);
            i--;
          }
        }
      }
    }
    res.send(results);
  })
})

app.get('/getclass', function (req, res) {
  console.log(req.query);
  connection.query("SELECT * FROM wasedadb.courses;", function (err, results, fields){
    res.send(results);
  })
})

app.post('/posttimetable', function (req, res) {
  //One query and fill table with results
  var timetable = [{"day": "Mon", "classes": [[],[],[],[],[],[],[]]},{"day": "Tues", "classes": [[],[],[],[],[],[],[]]},{"day": "Wed", "classes": [[],[],[],[],[],[],[]]},{"day": "Thur", "classes": [[],[],[],[],[],[],[]]},{"day": "Fri", "classes": [[],[],[],[],[],[],[]]},{"day": "Sat", "classes": [[],[],[],[],[],[],[]]}];
  var data = req.body;

  var query = "SELECT syllabusKey, courseTitle, building, room, term, day, period FROM wasedadb.courses WHERE `campus` LIKE '%"+data.campus+"%' AND `building` LIKE '%"+data.building+"%' AND `room` LIKE '%"+data.room+"%' AND `term` LIKE '%"+data.term+"%' OR `term` LIKE '%full%'";
  if (data.term.indexOf('summer')!= -1) query+= " OR `term` LIKE '%spring%'";
  else if (data.term.indexOf('winter')!= -1) query+= " OR `term` LIKE '%fall%'";
  query += ";";

  console.log(query);
  connection.query(query, function (err, results, fields) {

      console.log(results);
      for (i=0; i<results.length; i++) { //Adding classes to their respective timeslot
        if (results[i].day == "Mon") {
          timetable[0].classes[results[i].period-1].push({"courseTitle": results[i].courseTitle, "syllabusKey": results[i].syllabusKey})
        }
        else if (results[i].day == "Tue") {
          timetable[1].classes[results[i].period-1].push({"courseTitle": results[i].courseTitle, "syllabusKey": results[i].syllabusKey})
        }
        else if (results[i].day == "Wed") {
          timetable[2].classes[results[i].period-1].push({"courseTitle": results[i].courseTitle, "syllabusKey": results[i].syllabusKey})
        }
        else if (results[i].day == "Thur") {
          timetable[3].classes[results[i].period-1].push({"courseTitle": results[i].courseTitle, "syllabusKey": results[i].syllabusKey})
        }
        else if (results[i].day == "Fri") {
          timetable[4].classes[results[i].period-1].push({"courseTitle": results[i].courseTitle, "syllabusKey": results[i].syllabusKey})
        }
        else if (results[i].day == "Sat") {
          timetable[5].classes[results[i].period-1].push({"courseTitle": results[i].courseTitle, "syllabusKey": results[i].syllabusKey})
        }
      }
      res.send(timetable);
  })
})

app.post('/postclassroom', function (req, res) {
  var data = req.body;
  console.log(data.list);

  var query = "SELECT building, room FROM wasedadb.courses WHERE `campus` LIKE '%"+data.campus+"%' AND `day` LIKE '%"+data.day+"%' AND `period` LIKE '%"+data.period+"%' AND `term` LIKE '%"+data.term+"%'";
  query += ";";

  console.log(query);
  connection.query(query, function (err, results, fields) { //Remove classroom from list if there is a class
    for (i=0; i<results.length; i++) {
      for (j=0; j<data.list.length; j++) {
        if (data.list[j].building == results[i].building) {
          for (k=0; k<data.list[j].rooms; k++) {
            if (data.list[j].rooms[k] == results[i].room) {
              data.list[j].rooms.splice(k, 1);
              k--;
            }
          }
        }
      }
    }
    for (i=0; i<data.list.length; i++) {
      if (data.list[i].rooms.length == 1) {
        data.list.splice(i, 1);
        i--;
      }
    }
    res.send(data.list)
  })
})
