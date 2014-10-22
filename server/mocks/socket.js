module.exports = function(app) {
    var WebSocketServer = require('ws').Server,
        socketServer = new WebSocketServer({port: 8080});

    socketServer.on('connection', function(ws) {

        ws.on('message', function(message) {
            var messageFromClient = JSON.parse(message);

            ws.send('from the server: ' + messageFromClient);
        });

        console.log('Someone has connected.');
    });
};
