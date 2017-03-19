(function() {
  function vendorModule() {
    'use strict';

    return {
      'WebSocket': self.Mock.WebSocket,
      'Server': self.Mock.Server,
      'io': self.Mock.SocketIO,
    };
  }

  define('mock-socket', [], vendorModule); // eslint-disable-line no-undef
})();
