module.exports = function(app) {
    var WebSocketServer = require('ws').Server,
        socketServer = new WebSocketServer({port: 8080});

    socketServer.on('connection', function(ws) {

        ws.on('message', function(message) {
            console.log('received: %s', message);

            ws.send(message);
        });

        console.log('Someone has connected.');
    });
};
