const fs = require('fs');
const byline = require('byline');


function tleParse(fileNameIn,write=true,pathOut='./src/tle.json'){
    var parsedJson= {'time':String(new Date())}; 
    var counter = 0;
    var name, tle1, tle2, id; 
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(fileNameIn)
    });
    lineReader.on('line', function (line) {
        if(counter % 3 == 0){
            name = line.split("  ")[0];
        }
        else if(counter % 3 == 1){
            tle1 = line;
        }
        else if(counter % 3 == 2){
            tle2 = line; 
            id = line.replace(/  +/g, ' ').split(" ")[1]
            parsedJson[id] = {
                'tle1':tle1,
                'tle2':tle2,
                'id':id,
                'name':name
            }
        }
        counter++;
        lineReader.on('close',function(){
            if(write==true && Object.keys(parsedJson).length > 1){ // makes sure parsedJson included parsed data. Then writes that to file
                try {
                  fs.writeFileSync(pathOut, JSON.stringify(parsedJson))
                } catch (err) {
                    console.error(err)
                }
            }
            return(parsedJson);
        });
    });

}

module.exports = tleParse;