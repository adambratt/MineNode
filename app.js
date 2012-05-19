var net = require('net');
var io = require('socket.io').listen(9999);

// Attribute key is server port
serverList = {
  1: { ip: 'blockempires.com:1' },
  2: { ip: 'blockempires.com:2' }
}


var checkServers = function () {
  // Loop through all servers and fake a TCP Minecraft connection
  for (x in serverList){
    console.log('Trying server: '+x);
    var client = net.connect(x, 'blockempires.com', function() { //'connect' listener
      console.log('Connected to server');
      this.write(Buffer('FE','hex'));
    }).on('data', function(data) {
      var output = data.toString().replace(/\u0000/g,'');
      if( output.length ){
        // Hacky little method to split stuff up
        var specialchar = output[0];
        output = output.split(specialchar);
        output.shift();
        serverList[x].motd = output[0].substr(1);
        serverList[x].players = output[1];
        serverList[x].max = output[2];
        this.end();
      }
    }).on('error', function(err) {
      console.log("Error on server: "+x+", \n"+err);
    });
  }
  io.sockets.emit('status', serverList);
}

checkServers();
setInterval(checkServers, 5000);


io.sockets.on('connection', function (socket) {
  socket.emit('status', serverList);
});