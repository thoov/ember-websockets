/* eslint-env node */

module.exports = function() {
  const WebSocketServer = require('ws').Server;
  const socketServerA = new WebSocketServer({port: 8101});
  const socketServerB = new WebSocketServer({port: 8102});

  socketServerA.on('connection', function(ws) {
    ws.send('Connection opened up on server A');

    ws.on('message', function(message) {
      const messageFromClient = JSON.parse(message);
      ws.send('Recieved ' + messageFromClient + ' from the server A');
    });
  });

  socketServerB.on('connection', function(ws) {
    ws.send('Connection opened up on server B');

    ws.on('message', function(message) {
      const messageFromClient = JSON.parse(message);
      ws.send('Recieved ' + messageFromClient + ' from the server B');
    });
  });
};
