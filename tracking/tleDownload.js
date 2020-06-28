const http = require('http');
const fs = require('fs');

var tleDownload = function(url, dest, cb) {

  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    console.log("Can not Download TLE Data Error Message:",err.message);
  });
 
}

module.exports = tleDownload; 