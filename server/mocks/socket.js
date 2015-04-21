module.exports = function(app) {
  var intervalFunction;
  var WebSocketServer = require('ws').Server;
  var socketServer = new WebSocketServer({port: 8080});

  socketServer.on('connection', function(ws) {
    console.log('Someone has connected. ' + ws.upgradeReq.url);

    ws.on('message', function(message) {
      var messageFromClient = JSON.parse(message);
      ws.send('Recieved ' + messageFromClient + ' from the server');
    });

    ws.on('close', function(message) {
      clearInterval(intervalFunction);
    });

    intervalFunction = setInterval(function(){
      ws.send('Every 5 seconds the backend is sending a message.');
    }, 5000);
  });
};
