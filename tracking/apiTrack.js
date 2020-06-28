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
        tleJson = JSON.parse(fs.readFileSync('./tracking/tle.json','utf8'));
        callback(tleJson);
    }
    catch(err){
        console.log(err);
        tleDownload(configJson.tle.fetchUrl,'./tracking/tle.txt',()=>{
            tleParse('./tracking/tle.txt',true,'./tracking/tle.json');
            tleJson = JSON.parse(fs.readFileSync('./tracking/tle.json','utf8'));
            callback(tleJson)
        });
    }
    tleDate = new Date(tleJson.time);
    if(((new Date() - tleDate)/86400000) > configJson.tle.maxTleAgeDays){
        console.log("Updating Json Data");
        tleDownload(configJson.tle.fetchUrl,'./tracking/tle.txt',()=>{
            tleParse('./tracking/tle.txt','./tracking/tle.json',(parsedJson)=>{
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
    console.log("startign getPasses");
    readJson(((parsedJson)=>{
        try{
            satJson = parsedJson[String(NoradId)]
            console.log("Working");
            satObj = new satTrack(satJson.tle1,satJson.tle2,satJson.name,lat,long,alt);
            callback(satObj.passes(new Date(),duration*86400,(minAngle / 180)*Math.PI));
        }
        catch(err){
            console.log(err);
            console.log("Possibly Sat ID not in tle infromation ")
        }

    }));
}

module.exports = getPasses;