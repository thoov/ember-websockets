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
  * The addon tree is augmented with the impagination modules. This
  * makes them available not only to `ember-impagination` as a whole,
  * but also to the application if they want to embed it. It'll look
  * like:
  *    ember-impagination/components/impagination-dataset.js
  *    ember-impagination/templates/components/impagination-dataset.js
  *    impagination/dataset.js
  *    impagination/record.js
  *    impagination/page.js
  */
  treeForAddon: function() {
    // get the base addon tree
    var addonTree = this._super.treeForAddon.apply(this, arguments);

    // transpile the impagination sources into ES5. However, we want
    // to leave the ES6 module declaration in place because they'll be
    // handled later by ember-cli.
    var transpiled = new BabelTranspiler('node_modules/mock-socket/src', {
      loose: true,
      blacklist: ['es6.modules']
    });


    // take the transpiled impagination sources and put them into
    // `modules/impagination/{dataset|record|page}.js` so that the
    // ember-cli build will pick them up.
    var impagination = new Funnel(transpiled, {
      destDir: 'modules/mock-socket'
    });

    return new MergeTrees([addonTree, impagination]);
  },

  included: function(app) {
    this._super.included(app);

    var stats;
    var socketIOPath = app.bowerDirectory + '/socket.io-client/socket.io.js';

    app.import(app.bowerDirectory + '/urijs/src/URI.min.js');

    try {
      stats = fs.lstatSync(socketIOPath);

      /*
      * Only import the socket.io file if one is found
      */
      if(stats.isFile() && !process.env.EMBER_CLI_FASTBOOT) {
        app.import(socketIOPath);
      }
    }
    catch(e) {}
  }
};
