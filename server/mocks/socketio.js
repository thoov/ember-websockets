module.exports = function(app) {
  var io = require('socket.io')(7100);

  io.on('connection', function (socket) {
    console.log('Connection made on socketIO');

    socket.send('sadad');
    socket.on('message', function () { });
    socket.on('disconnect', function () { });
  });
};
