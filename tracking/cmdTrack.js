const fs = require("fs");
const fetch = require("node-fetch");

function getTransits(callback){
    baseUrl = "http://localhost:3000"; //the address of the express js server running sat tracking
        var promisesUrl=[];
        fetch(baseUrl+"/api/v1/config")
            .then((config) => config.json())
            .then((config)=> {
                for(var i in config.tracking.ids){ //apiTrack(req.params.id,req.params.lat,req.params.long,req.params.alt,req.params.days,req.params.minAngle,(parsedJson)
                    promisesUrl.push(`${baseUrl}/api/v1/passes/${config.tracking.ids[i]}/${config.tracking.location.lat}/${config.tracking.location.long}/${config.tracking.location.alt}/${config.tracking.days}/${config.tracking.minAngle}`);
                }
                console.log(promisesUrl);
                Promise.all(promisesUrl.map(url => fetch(url).then(satPasses =>satPasses.json())))
                    .then((satPasses) => {
                        //combine all the passes into one list
                        var allPasses = [];  
                        for(var i in satPasses){
                            allPasses = allPasses.concat(satPasses[i].passes);
                            allPasses.sort((a,b) =>{
                                return(a.startUTC - b.startUTC); 
                            });
                        }
                        callback(config,allPasses);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
}

/* use a function for the exact format desired... */
function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'}
   
   var d = new Date();
   print(ISODateString(d)); // prints something like 2009-09-28T19:03:12Z
   

function cmdTrack(){
    //first
    //get appConfig.json and allPasses by calling getTransits
    getTransits((config,allPasses) => {
        console.log("STARTING CMD TRACK");
        setInterval((config,allPasses) => {
            if(allPasses[0].startUTC <= Math.floor(new Date() / 1000)){
                var processingSat = config.processing.find((item) => item.id == allPasses[0].satid); //processing object in appConfig
                var unixTime = Math.floor(new Date() / 1000);
                var duration = allPasses[0].duration;
                for(var i = 0; i<processingSat.commands.length; i++){ //loop through commands listed
                    //replace {t} -> with unixTime 
                    //replace {d} -> with duration 
                    var command = processingSat.commands[i];
                    command = command.replace("{t}",unixTime);
                    command = command.replace("{d}",duration);
                    command = command.replace("{r}",ISODateString(new Date(allPasses[0].startUTC*1000)));
                    console.log("starting: "+command);
                    require("child_process").execSync(command).toString()

                    //remove the first item in array 
                    allPasses.shift();
                    if(allPasses.length<5){
                        cmdTrack();
                        break;
                    }
                }
            }

        },config.reTime,config,allPasses);

    });

}

cmdTrack();

module.exports = cmdTrack; 
