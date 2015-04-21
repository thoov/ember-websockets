/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-websockets',
  included: function(app) {
    this._super.included(app);
    app.import(app.bowerDirectory + '/uri.js/src/URI.min.js');
  }
};
