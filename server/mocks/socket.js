/* eslint-env node */

module.exports = function() {
  const WebSocketServer = require('ws').Server;
  const socketServer = new WebSocketServer({port: 8080});

  socketServer.on('connection', function(ws) {
    console.log('Someone has connected. ' + ws.upgradeReq.url); // eslint-disable-line no-console

    ws.on('message', function(message) {
      const messageFromClient = JSON.parse(message);
      ws.send('Recieved ' + messageFromClient + ' from the server');
    });

    ws.on('close', function() {
      clearInterval(intervalFunction);
    });

    const intervalFunction = setInterval(function(){
      ws.send('Every 5 seconds the backend is sending a message.');
    }, 5000);
  });
};
