module.exports = function(app) {
    var WebSocketServer = require('ws').Server,
        socketServer = new WebSocketServer({port: 8081});

    socketServer.on('connection', function(ws) {
        console.log('Connected to test websocket');
        ws.send('This is a sample message');
    });
};
