module.exports = function(app) {
  var WebSocketServer = require('ws').Server;
  var socketServerA = new WebSocketServer({port: 8101});
  var socketServerB = new WebSocketServer({port: 8102});

  socketServerA.on('connection', function(ws) {
    ws.send('Connection opened up on server A');

    ws.on('message', function(message) {
      var messageFromClient = JSON.parse(message);
      ws.send('Recieved ' + messageFromClient + ' from the server A');
    });
  });

  socketServerB.on('connection', function(ws) {
    ws.send('Connection opened up on server B');

    ws.on('message', function(message) {
      var messageFromClient = JSON.parse(message);
      ws.send('Recieved ' + messageFromClient + ' from the server B');
    });
  });
};
