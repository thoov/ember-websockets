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

      if(stats.isFile()) {
        app.import(socketIOPath);
      }
    }
    catch(e) {
      throw new Error('Error reading socket.io file. Please run `ember g socket-io` first');
    }
  }
};
