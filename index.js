'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    let app = this._findHost(this);

    const appConfig = app.project.config(process.env.EMBER_ENV);
    if (
      appConfig['ember-websockets'] &&
      appConfig['ember-websockets']['socketIO'] === true
    ) {
      this.import('node_modules/socket.io-client/dist/socket.io.min.js');
    }
  },
};
