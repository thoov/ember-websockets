module.exports = function(app) {
    var intervalFunction;
        WebSocketServer = require('ws').Server,
        socketServer = new WebSocketServer({port: 8084});

    socketServer.on('connection', function(ws) {
        console.log('Someone has connected. ' + ws.upgradeReq.url);
    });
};
