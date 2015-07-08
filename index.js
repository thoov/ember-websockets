/* jshint node: true */
'use strict';

var fs = require('fs');

module.exports = {
  name: 'ember-websockets',
  included: function(app) {
    this._super.included(app);

    var stats;
    var socketIOPath = app.bowerDirectory + '/socket.io-client/socket.io.js';

    app.import(app.bowerDirectory + '/uri.js/src/URI.min.js');

    try {
      stats = fs.lstatSync(socketIOPath);

      /*
      * Only import the socket.io file if one is found
      */
      if(stats.isFile()) {
        app.import(socketIOPath);
      }
    }
    catch(e) {}
  }
};
