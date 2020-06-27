const fs = require('fs');
//local 
const satTrack = require('./satTrack.js');
const tleParse = require('./tleParse.js');
const tleDownload = require('./tleDownload.js'); 

//Configuration Json 
const configJson = require('../appConfig.json');

function readJson(callback){
    var tleJson;
    var tleDate;
    console.log("readJson starting");
    try{
        tleJson = JSON.parse(fs.readFileSync('./tle.json','utf8'));
        callback(tleJson);
    }
    catch(err){
        console.log(err);
        tleDownload(configJson.tle.fetchUrl,'./tle.txt',()=>{
            tleParse('./tle.txt',true,'./tle.json');
            tleJson = JSON.parse(fs.readFileSync('./tle.json','utf8'));
            callback(tleJson)
        });
    }
    tleDate = new Date(tleJson.time);
    if(((new Date() - tleDate)/86400000) > configJson.tle.maxTleAgeDays){
        console.log("Update");
        tleDownload(configJson.tle.fetchUrl,'./tle.txt',()=>{
            tleParse('./tle.txt','./tle.json',(parsedJson)=>{
                callback(parsedJson);
            });
        });
    }
    else{
    }
}

function getPasses(NoradId,lat,long,alt,duration,minAngle,callback){ // duration into the future in days
    var satJson;
    var satObj; //an instance of satTrack
    console.log("start");
    readJson(((parsedJson)=>{
        console.log("start Callback");
        try{
            satJson = parsedJson[String(NoradId)]
            console.log("Working");
            satObj = new satTrack(satJson.tle1,satJson.tle2,satJson.name,lat,long,alt);
            console.log(satObj);
            callback(satObj.passes(new Date(),duration*86400,(minAngle / 180)*Math.PI));
        }
        catch(err){
            console.log(err);
            console.log("Possibly Sat ID not in tle infromation ")
        }

    }));
}

module.exports = getPasses;