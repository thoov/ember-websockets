/* jshint node: true */
'use strict';

var fs = require('fs');
var BabelTranspiler = require('broccoli-babel-transpiler');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-websockets',

  /**
  * https://github.com/ember-cli/ember-cli/issues/2949#issuecomment-85634073
  *
  * The addon tree is augmented with the mock-socket modules. This
  * makes them available not only to `ember-websocket` as a whole,
  * but also to the application if they want to embed it.
  */
  treeForAddon: function() {
    // get the base addon tree
    var addonTree = this._super.treeForAddon.apply(this, arguments);

    // transpile the mock-socket sources into ES5. However, we want
    // to leave the ES6 module declaration in place because they'll be
    // handled later by ember-cli.
    var transpiled = new BabelTranspiler('node_modules/mock-socket/src', {
      loose: true,
      blacklist: ['es6.modules']
    });

    // take the transpiled mock-socket sources and put them into
    // `modules/mock-socket/{server|websocket}.js` so that the
    // ember-cli build will pick them up.
    var mockSocket = new Funnel(transpiled, {
      destDir: 'modules/mock-socket'
    });

    return new MergeTrees([addonTree, mockSocket]);
  },

  included: function() {
    this._super.included.apply(this, arguments);

    if (!process.env.EMBER_CLI_FASTBOOT) {
      var host = this._findHost();
      var socketIOPath = host.bowerDirectory + '/socket.io-client/dist/socket.io.js';
      var uriPath = host.bowerDirectory + '/urijs/src/URI.min.js';

      this.import(uriPath);

      // Only import the socket.io file if one is found
      try {
        var stats = fs.lstatSync(socketIOPath);

        if(stats.isFile()) {
          this.import(socketIOPath);
        }
      }
      catch(e) {}
    }
  }
};
