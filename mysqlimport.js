var fs = require('fs'),
  request = require('request'),
  bodyParser = require('body-parser'),
  cheerio = require('cheerio'),
  sanitizeHtml = require('sanitize-html'),
  escQuote = require('escape-quotes'),
  mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wasedadb'
});


require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var errStream = fs.createWriteStream('errorIndex.txt');
var sqlError = fs.createWriteStream('sqlErrorLog.txt');

var keys = require('./masterKeys.txt').split('\n');
var iniIndex = 31275;
// var maxIndex = iniIndex+5000;
var maxIndex = keys.length;


for (var j=iniIndex; j<maxIndex; j++) {

  setTimeout( function (j) {
    request('https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey='+keys[j]+'&pLng=en', function(err, res, html){
      console.log(j);

      if (err) {
        console.log(" Error: "+keys[j]+" ========================");
        errStream.write(keys[j]+"\n");
      } 


      else {
        var $ = cheerio.load(res.body, {
          decodeEntities: false
        });

        var data = $('#cEdit').html().split('\n');
        for (i=0; i<data.length; i++) {
          if (data[i].indexOf('>Year<') != -1) {
            i++;
            var year = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>School<') != -1) {
            i++;
            var school = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('Course Title') != -1) {
            i++;
            var courseTitle = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Instructor<') != -1) {
            i++;
            var instructor = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Term/Day/Period<') != -1) {
            i++;
            var termDayPeriod = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Category<') != -1) {
            i++;
            var category = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Eligible Year<') != -1) {
            i++;
            var eligibleYear = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []}); 
          }
          else if (data[i].indexOf('>Credits<') != -1) {
            i++;
            var credits = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Classroom<') != -1) {
            i++;
            var classroom = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Campus<') != -1) {
            i++;
            var campus = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Course Key<') != -1) {
            i++;
            var courseKey = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Course Class Code<') != -1) {
            i++;
            var courseClassCode = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Main Language<') != -1) {
            i++;
            var mainLanguage = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Course Code<') != -1) {
            i++;
            var courseCode = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>First Academic disciplines<') != -1) {
            i++;
            var firstAcademicDisciplines = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Second Academic disciplines<') != -1) {
            i++;
            var secondAcademicDisciplines = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Third Academic disciplines<') != -1) {
            i++;
            var thirdAcademicDisciplines = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Level<') != -1) {
            i++;
            var level = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Types of lesson<') != -1) {
            i++;
            var typesOfLesson = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Course Outline<') != -1) {
            i++;
            var courseOutline = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Objectives<') != -1) {
            i++;
            var objectives = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('Course Schedule') != -1) {
            i+=3;
            var courseSchedule = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Textbooks<') != -1) {
            i++;
            var textbooks = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Reference<') != -1) {
            i++;
            var reference = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
          else if (data[i].indexOf('>Evaluation<') != -1) {
            i++;
            if (data[i].indexOf('<table') != -1) {
                var evaluationTable = "";
                while (data[i].indexOf('</table>') != -1) {
                  evaluationTable += data[i];
                  i++;
                }
                var evaluation = sanitizeHtml(evaluationTable, {allowedTags: [], allowedAttributes: []});
            } else {
              var evaluation = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
            }
          }
          else if (data[i].indexOf('>Note / URL<') != -1) {
            i++;
            var noteUrl = sanitizeHtml(escQuote(data[i]), {allowedTags: [], allowedAttributes: []});
          }
        }

        // var query = "INSERT INTO courses (syllabusKey, courseOutline)";
        // query += "VALUES ('"+keys[j]+"','"+courseOutline+"')";
        // console.log(courseOutline);

        var query = "INSERT INTO courses (syllabusKey, dataIndex, year, school, courseTitle, instructor, termDayPeriod, category, eligibleYear, credits, classroom, campus, courseKey, courseClassCode, mainLanguage, courseCode, firstAcademicDisciplines, secondAcademicDisciplines, thirdAcademicDisciplines, level, typesOfLesson, courseOutline, objectives, courseSchedule, textbooks, reference, evaluation, noteUrl)";
        query += "VALUES ('"+keys[j]+"','"+j+"','"+year+"','"+school+"','"+courseTitle+"','"+instructor+"','"+termDayPeriod+"','"+category+"','"+eligibleYear+"','"+credits+"','"+classroom+"','"+campus+"','"+courseKey+"','"+courseClassCode+"','"+mainLanguage+"','"+courseCode+"','"+firstAcademicDisciplines+"','"+secondAcademicDisciplines+"','"+thirdAcademicDisciplines+"','"+level+"','"+typesOfLesson+"','"+courseOutline+"','"+objectives+"','"+courseSchedule+"','"+textbooks+"','"+reference+"','"+evaluation+"','"+noteUrl+"')";

        connection.query(query, function (err) {
          if (err) {
            errStream.write(j+"\n");
            sqlError.write(j+": "+err+"\n");
            console.log("mySQL Error ====================");
          }
          else { 
            console.log('added entry');
          }
        });


        if (j === maxIndex-1) {
          console.log("Waiting...");
          setTimeout(function() {
            console.log('Finish');
            connection.end();
            errStream.end();
          }, 15000);
        }
      }
    });
  }, (j-iniIndex)*500, j);
}