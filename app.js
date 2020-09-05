var express = require('express');
var cors = require("cors");
var bodyParser = require('body-parser');
const path = require('path');
var glob = require("glob")
const fs = require('fs');
//File System Actions
//const csv = require("csv-parse");
//var dur = require('./duration.js');
const readLastLines = require('read-last-lines');

//User
const apiTrack = require('./tracking/apiTrack.js');
const cmdTrack = require("./tracking/cmdTrack.js");
const appConfig = JSON.parse(fs.readFileSync('./appConfig.json'));

//start tracking function 
//cmdTrack(); 

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'/client/build')));
app.use(cors());

// view engine setup

//APP STARTS HERE 
const mainDir = "../";

app.get('/api/v1/content/all/:method', async function (req, res){
  // api that returns the list of images and recordings found
  // :method specifies the sorthing method 
  // options: new - sorts newest to oldest 
  // options: old - sorts oldest to newest
  // options: type - sorts by satalite type 

  var contentSat =[];
  glob(mainDir+"*.png",function (er, files) { // search only for .wav files in the directory ../
      for(var i = 0; i<files.length; i++){
        var name = files[i];
        var fileName = name.slice(mainDir.length,name.length-4);
        var satName = name.slice(mainDir.length,9);
        var passTime = parseInt(name.slice(mainDir.length+7,23));
        var isImage = (name.slice(mainDir.length+21,27)=="png");
          var dictSat = {
            'success':true,
            'satName':satName,
            'passTime':passTime,
            'isImage':isImage,
            'fileName':fileName,
          }
          contentSat.push(dictSat);
      }
      if(req.params.method == 'new'){
        console.log('new')
        contentSat.sort(function(a,b){
          return(b.passTime-a.passTime)
        });
      }
      else if(req.params.method == 'old'){
        console.log('old')
        contentSat.sort(function(a,b){
          return(a.passTime-b.passTime)
        });
      }

      res.status(200).json(contentSat);

    })
});

app.get('/api/v1/content/specific/:method/:searchKey/', function (req, res){
  // api that returns the list of images and recordings found acording to specific search pattern
  // :method specifies the sorting method 
  // :searchKey the regex search parameter can not contain slashes
  // options: new - sorts newest to oldest 
  // options: old - sorts oldest to newest
  // options: type - sorts by satalite type


  if(req.params.searchKey.includes("/") || req.params.searchKey.includes("\\")){
    res.status(401).json(
      {
        'success':false,
        'message':"Unauthorized Request, no / or // character permited"
      }
      );
  }

  var contentSat =[];
  glob(mainDir+req.params.searchKey+".wav",function (er, files) { // search only for .wav files in the directory ../
      for(var i = 0; i<files.length; i++){
        var name = files[i];
        var fileName = name.slice(mainDir.length,name.length-4);
        var satName = name.slice(mainDir.length,9);
        var passTime = parseInt(name.slice(10,23));
          var dictSat = {
            'success':true,
            'satName':satName,
            'passTime':passTime,
            'fileName':fileName,
          }
          contentSat.push(dictSat);
      }
      if(req.params.method == 'new'){
        console.log('new')
        contentSat.sort(function(a,b){
          return(b.passTime-a.passTime)
        });
      }
      else if(req.params.method == 'old'){
        console.log('old')
        contentSat.sort(function(a,b){
          return(a.passTime-b.passTime)
        });
      }
      res.status(200).json(contentSat);
    })

});


app.get('/api/v1/current/:measure', function (req,res){
  if(req.params.measure == "temp"){
    readLastLines.read(mainDir+'tempData.csv', 1)
    .then((lines) => res.json(
      {
        'success':true,
        'temperature':(parseFloat(lines.split(",")[1]))
      }
    ));
  }
  else{
    readLastLines.read(mainDir + 'tempData.csv', 1)
    .then((lines) => res.json(
      {
        'success':true,
        'humidity':(parseFloat(lines.split(",")[2]))
      }
      ));
  }
  });

app.get('/api/v1/passes/:id/:lat/:long/:alt/:days/:minAngle', function (req,res) {

  apiTrack(req.params.id,req.params.lat,req.params.long,req.params.alt,req.params.days,req.params.minAngle,(parsedJson)=>{
    res.status(200).json(parsedJson);
  });
});

app.get('/api/v1/config', function (req,res){
  res.status(200).json(appConfig);
});

  app.post('/api/v1/measure/range', function (req, res) {
    /* body form 
    {
      'startTime':'yyyy-mm-dd',
      'endTime':'yyyy-mm-dd'
    }
*/
//Also any time format that can be parsed by Date() will also work
//Passing "all" as the value for startTime will return the entire csv data array 

  //var {startTime, endTime} = req.body; 
  console.log(req.body);
  var startDate = new Date(req.body.startTime);
  var endDate = new Date(req.body.endTime);
  var rowValues = [];
    fs.createReadStream('../../tempData.csv')
  .pipe(csv())
  .on('error',() => {
    console.log("error continuing");
  })
  .on('data', (row) => {
    if(req.body.startTime == 'all'){
      if(row.length == 3){
      rowValues.push({'time':row[0],'temp':row[1],'hud':row[2]});
      }
    }
    else{
      if( (parseInt(row[0]) > startDate.getTime()/1000) && (parseInt(row[0]) < endDate.getTime()/1000)){
        if(row.length ==3){
         rowValues.push({'time':row[0],'temp':row[1],'hud':row[2]});
        }
      }
    }
  })
  .on('end', () => {
    res.status(200).json(rowValues);
  });
  })

//Run react app. It is last so it catches all events that the api do not sastify
app.get('*', function(req,res){ 
   res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

module.exports = app;

//app.listen(81);

