/* eslint-env node */

module.exports = function () {
  var io = require('socket.io')(7100);

  io.on('connection', function (socket) {
    console.log('Connection made on socketIO'); // eslint-disable-line no-console

    socket.on('message', function (message) {
      const messageFromClient = JSON.parse(message);
      socket.send('Recieved ' + messageFromClient + ' from the server');
    });

    socket.on('disconnect', function () {
      clearInterval(intervalFunction);
    });

    const intervalFunction = setInterval(function () {
      socket.send(
        'Every 5 seconds the backend is sending a message via socket.io.'
      );
    }, 5000);
  });
};
