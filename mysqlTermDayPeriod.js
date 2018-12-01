var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wasedadb'
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

connection.query("SELECT * FROM wasedadb.courses", function (err, results, fields){
  for (var i=0; i<results.length; i++) {
    var data = results[i].termDayPeriod.split('  ');
    var termDump = data[0].split('／');

    var term = [];
    var courseDuration = [];

    for (var j=0; j<termDump.length; j++) {
      var season = '', duration = '';
      if (termDump[j].indexOf('spring') != -1) { season = 'spring'; }
      else if (termDump[j].indexOf('summer') != -1) { season = 'summer'; }
      else if (termDump[j].indexOf('fall') != -1) { season = 'fall'; }
      else if (termDump[j].indexOf('winter') != -1) { season = 'winter'; }
      else if (termDump[j].indexOf('full year') != -1) { season = 'full'; duration = 'full'; }

      if (termDump[j].indexOf('intensive') != -1) { duration = 'intensive'; }
      else if (termDump[j].indexOf('semester') != -1) { duration = 'semester'; }
      else if (termDump[j].indexOf('quarter') != -1) { duration = 'quarter'; }
      else if (termDump[j].indexOf('term') != -1) { duration = 'term'; }

      term.push(season);
      courseDuration.push(duration)
    }


    var day = [];
    var period = [];

    var timeslot = data[1].split('／');
    if (timeslot.length > 1) {
      for (var j=0; j<timeslot.length; j++){
        if (timeslot[j].indexOf('others') != -1) {
          day.push(timeslot[j].split('.')[0]);
          period.push(0);
        }
        else if (timeslot[j].split('.')[1].indexOf('-') == -1) {
          day.push(timeslot[j].split('.')[0].substring(3));
          period.push(timeslot[j].split('.')[1]);
        } 
        else {
          var periodslot = timeslot[j].split('.')[1].split('-');
          for (var k=periodslot[0]; k <= periodslot[1]; k++) {
            day.push(timeslot[j].split('.')[0].substring(3));
            period.push(k);
          }
        }
      }
    }
    else {
      if (timeslot[0] == '') {
        day.push('');
        period.push(0);
      }
      else {
        if (timeslot[0].indexOf('others') != -1) {
          day.push(timeslot[0].split('.')[0]);
          period.push(0);
        }
        else if (timeslot[0].split('.')[1].indexOf('-') == -1) {
          day.push(timeslot[0].split('.')[0]);
          period.push(timeslot[0].split('.')[1]);
        } 
        else {
          var periodslot = timeslot[0].split('.')[1].split('-');
          for (var k=periodslot[0]; k <= periodslot[1]; k++) {
            day.push(timeslot[0].split('.')[0]);
            period.push(k);
          }
        }
      }
    }

    var classroomDump = results[i].classroom.split('／');
    var building = [];
    var room = [];

    var tBuilding = '', tRoom = '';
    if (classroomDump.length > 1) {
      if (classroomDump[1].indexOf('02:') == -1) {
        tBuilding = classroomDump[0].substring(3)+classroomDump[1];
        building.push(tBuilding);
        room.push(tRoom);
      }
      else {
        for (var j=0; j<classroomDump.length; j++) {
          tBuilding = classroomDump[j].split('-')[0].substring(3);      
          if (classroomDump[j].indexOf('-') != -1) { tRoom = classroomDump[j].split('-')[1]; }
          else { tRoom = ''; }
          building.push(tBuilding);
          room.push(tRoom);
        }
      }
    }
    else {
      if (classroomDump[0] == "ﾄﾚ-ﾆﾝｸﾞ室･体力測定室" || classroomDump[0].indexOf("ｽﾎﾟ-ﾂﾎｰﾙ") != -1) {
        tBuilding = classroomDump[0];
      }
      else {
        tBuilding = classroomDump[0].split('-')[0];      
        if (classroomDump[0].indexOf('-') != -1) { tRoom = classroomDump[0].split('-')[1]; }
        else { tRoom = ''; }
      }
      building.push(tBuilding);
      room.push(tRoom);
    }

    // console.log("Term: "+term+" - "+courseDuration);
    // console.log("Day: "+day);
    // console.log("Period: "+period);
    // console.log("Building: "+building);
    // console.log("Room: "+room);
    // console.log();

    var query = "UPDATE `wasedadb`.`courses` SET ";
    query += "`term`='"+term+"', `day`='"+day+"', `period`='"+period+"', `courseDuration`='"+courseDuration+"', `building`='"+building+"', `room`='"+room+"'";
    query += " WHERE `syllabusKey`='"+results[i].syllabusKey+"';";

    connection.query(query, function (err) {
      if (err) {
        console.log("mySQL Error ====================");
        console.log(err);
      }
    });


    //Mongo
  }
})
















    // MongoClient.connect(url, function(err, client) {
    //   if (err) throw err;
    //   var db = client.db('wasedadb');
    //   db.collection("courses").insertOne({
    //     syllabusKey: results[j].syllabusKey,
    //     dataIndex: results[j].dataIndex,
    //     year: results[j].year,
    //     school: results[j].school,
    //     courseTitle: results[j].courseTitle,
    //     instructor: results[j].instructor,

    //     term: term,
    //     courseDuration: courseDuration,
    //     day: day,
    //     period: period,

    //     category: results[j].category,
    //     eligibleYear: results[j].eligibleYear, 
    //     credits: results[j].credits,

    //     building: building,
    //     room: room,

    //     campus: results[j].campus,
    //     courseKey: results[j].courseKey,
    //     courseClassCode: results[j].courseClassCode,
    //     mainLanguage: results[j].mainLanguage,
    //     courseCode: results[j].courseCode,
    //     firstAcademicDisciplines: results[j].firstAcademicDisciplines,
    //     secondAcademicDisciplines: results[j].secondAcademicDisciplines,
    //     thirdAcademicDisciplines: results[j].thirdAcademicDisciplines,
    //     level: results[j].level,
    //     typesOfLesson: results[j].typesOfLesson,
    //     courseOutline: results[j].courseOutline,
    //     objectives: results[j].objectives,
    //     courseSchedule: results[j].courseSchedule,
    //     textbooks: results[j].textbooks,
    //     reference: results[j].reference,
    //     evaluation: results[j].evaluation,
    //     noteUrl: results[j].noteUrl

    //   }, function(err, result) {
    //     if (err) throw err;
    //     console.log(result[j].courseTitle+" was added");
    //     client.close();
    //   });
    // });