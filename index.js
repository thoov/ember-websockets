/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-websockets',
  included: function (app) {
    this.app = app;
    app.import(app.bowerDirectory + '/uri.js/src/URI.min.js');
  },
};
