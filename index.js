/* jshint node: true */
'use strict';

var fs = require('fs');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-websockets',

  treeForVendor() {
    return new Funnel('node_modules/mock-socket/dist', {
      destDir: 'mock-socket'
    });
  },

  included: function() {
    this._super.included.apply(this, arguments);

    if (!process.env.EMBER_CLI_FASTBOOT) {
      var host;

      // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
      // use that.
      if (typeof this._findHost === 'function') {
        host = this._findHost();
      } else {
        // Otherwise, we'll use this implementation borrowed from the _findHost()
        // method in ember-cli.
        var current = this;
        do {
          host = current.app || host;
        } while (current.parent.parent && (current = current.parent));
      }

      var socketIOPath = host.bowerDirectory + '/socket.io-client/dist/socket.io.js';

      host.import(host.bowerDirectory + '/urijs/src/URI.min.js');
      host.import('vendor/mock-socket/mock-socket.js');
      host.import('vendor/shims/mock-socket.js');

      // Only import the socket.io file if one is found
      try {
        var stats = fs.lstatSync(socketIOPath);

        if(stats.isFile()) {
          host.import(socketIOPath);
        }
      }
      catch(e) {}
    }
  }
};
