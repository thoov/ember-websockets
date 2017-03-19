/* eslint-env node */

module.exports = function(/* app */) {
  const WebSocketServer = require('ws').Server;
  const socketServer = new WebSocketServer({port: 8084});

  socketServer.on('connection', function(ws) {
    console.log('Someone has connected. ' + ws.upgradeReq.url);  // eslint-disable-line no-console
  });
};
