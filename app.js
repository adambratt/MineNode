var net = require('net');
var client = net.connect(1, 'blockempires.com', function() { //'connect' listener
  console.log('client connected');
  client.write(Buffer('FE','hex'));
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
