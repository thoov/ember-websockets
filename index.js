/* eslint-env node */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    let app = this._findHost(this);
    if (
      app.options['ember-websockets'] &&
      app.options['ember-websockets']['socketIO'] === true
    ) {
      this.import(`vendor/${this.name}/socket.io-client/socket.io.slim.js`);
    }
  },

  treeForVendor() {
    const mockSocketPath = require.resolve('mock-socket');
    const socketIOClientPath = require.resolve('socket.io-client');

    return new Merge([
      new Funnel(__dirname + '/vendor', { destDir: this.name }),
      new Funnel(path.dirname(mockSocketPath), {
        destDir: this.name + '/mock-socket',
      }),
      fastbootTransform(
        new Funnel(path.join(path.dirname(socketIOClientPath), '../dist'), {
          destDir: this.name + '/socket.io-client',
        })
      ),
    ]);
  },
};
