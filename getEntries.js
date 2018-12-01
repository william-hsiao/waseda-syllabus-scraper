var mysql = require('mysql'),
  fs = require('fs');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wasedadb'
});

var year = [];
var school = [];
var termDayPeriod = [];
var category = [];
var classroom = [];
var campus = [];

connection.query("SELECT * FROM wasedadb.courses", function (err, results, fields){
  for (var i=0; i<results.length; i++) {

    // if (!year.includes(results[i].year)){
    //   year.push(results[i].year);
    // }
    // if (!school.includes(results[i].school)){
    //   school.push(results[i].school);
    // }
    // if (!category.includes(results[i].category)){
    //   category.push(results[i].category);
    // }


    // if (!termDayPeriod.includes(results[i].termDayPeriod)){
    //   termDayPeriod.push(results[i].termDayPeriod);
    // }



    // {
    //   "name": campus,
    //   "buildings": [
    //     {
    //       "building": buildingNum
    //       "rooms": []
    //     }
    //   ]
    // }


    var campusIndex, buildingIndex;

    // console.log("CAMPUS INDEX: "+campus.map(function (d) {return d['name'];}).indexOf(results[i].campus));
    if ((campusIndex = campus.map(function (d) {return d['name'];}).indexOf(results[i].campus)) != -1 ){
      // console.log("campus found");
      // campusIndex = campus.map(function (d) {return d['name'];}).indexOf(results[i].campus)
    } else {
      campus.push({"name": results[i].campus, "buildings": []});
      campusIndex = campus.length - 1;
      // console.log("Push new campus");
    }
      // console.log("CampusIndex: "+campusIndex);

    // console.log(campus);
    // console.log();

    var tempBuildings = results[i].building.split(',');
    var tempRooms = results[i].room.split(',');
    // console.log(tempBuildings);
    // console.log(tempRooms);


    for (var j = 0; j < tempBuildings.length; j++) {
      // console.log("SEARCHING..." + tempBuildings[j]);
      // console.log(campus[campusIndex].buildings);
      // console.log(campus[campusIndex].buildings.map(function (d) {return d['building'];}).indexOf(tempBuildings[j]));

      if ((buildingIndex = campus[campusIndex].buildings.map(function (d) {return d['building'];}).indexOf(tempBuildings[j])) != -1) {
        // console.log("Building Found");
      } else {
        // console.log("PUSH new BUILDING");
        campus[campusIndex].buildings.push({"building": tempBuildings[j], "rooms": []});
        buildingIndex = campus[campusIndex].buildings.length - 1;
      }
      // console.log('rooms =================================');
      // console.log(campus);
      // console.log("CAMPUS INDEX: "+campusIndex);
      // console.log(campus[campusIndex].buildings);
      // console.log("BUILDING INDEX: "+buildingIndex);
      // console.log();

      if (!campus[campusIndex].buildings[buildingIndex].rooms.includes(tempRooms[j])){
        campus[campusIndex].buildings[buildingIndex].rooms.push(tempRooms[j]);
      }
      // console.log("ROOMS: "+campus[campusIndex].buildings[buildingIndex].rooms)
      // console.log();

    }
  }

  // console.log(year.sort());
  // fs.writeFile("./lists/year.txt", year.sort(), function(err) {
  //   if (err) throw err;
  // });
  // console.log(school.sort());
  // fs.writeFile("./lists/school.txt", school.sort(), function(err) {
  //   if (err) throw err;
  // });
  // console.log(category.sort());
  // fs.writeFile("./lists/category.txt", category.sort(), function(err) {
  //   if (err) throw err;
  // });



  // console.log(termDayPeriod.sort());
  // fs.writeFile("./lists/termDayPeriod.txt", termDayPeriod.sort(), function(err) {
  //   if (err) throw err;
  // });


  // console.log(classroom.sort());
  // fs.writeFile("./lists/classroom.txt", classroom.sort(), function(err) {
  //   if (err) throw err;
  // });
  // console.log(campus.sort());
  // fs.writeFile("./lists/campus.txt", campus.sort(), function(err) {
  //   if (err) throw err;
  // });
  for (i = 0; i<campus.length; i++) {
    campus[i].buildings = campus[i].buildings.sort( function(a,b) {
      return a.building - b.building;
    });
    for (j=0; j<campus[i].buildings.length; j++)
      campus[i].buildings[j].rooms = campus[i].buildings[j].rooms.sort();
  }

  fs.writeFile("./lists/mapping.txt", JSON.stringify(campus), function(err) {
    if (err) throw err;
  });
  console.log(campus);
  console.log(campus[0].buildings);
  console.log(campus[0].buildings[0].rooms.sort());

})

connection.end();

