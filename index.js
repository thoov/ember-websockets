/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs');
const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-websockets',

  included() {
    this._super.included.apply(this, arguments);
    this._shimImport();

    this.import(`vendor/${this.name}/urijs/URI.min.js`);

    if (this._readConfigProp('socketIO') === true) {
      this.import(`vendor/${this.name}/socket.io-client/socket.io.slim.js`);
    }
  },

  treeForVendor() {
    const urijsPath = require.resolve('urijs');
    const mockSocketPath = require.resolve('mock-socket');
    const socketIOClientPath = require.resolve('socket.io-client');

    return new Merge([
      new Funnel(__dirname + '/vendor', { destDir: this.name }),
      fastbootTransform(new Funnel(path.dirname(urijsPath), { destDir: this.name + '/urijs' })),
      new Funnel(path.dirname(mockSocketPath), { destDir: this.name + '/mock-socket' }),
      fastbootTransform(new Funnel(path.join(path.dirname(socketIOClientPath), '../dist'), { destDir: this.name + '/socket.io-client' }))
    ]);
  },

  // https://github.com/ember-intl/ember-intl/blob/dd2a90b2ccf94000a92394565d048c42089aef9b/index.js#L144-L161
  _readConfig(environment) {
    const project = this.project || this.app.project;

    // NOTE: For ember-cli >= 2.6.0-beta.3, project.configPath() returns absolute path
    // while older ember-cli versions return path relative to project root
    const configPath = path.dirname(project.configPath());
    let config = path.join(configPath, 'environment.js');

    if (!path.isAbsolute(config)) {
      config = path.join(project.root, config);
    }

    if (fs.existsSync(config)) {
      return require(config)(environment);
    }

    return {
      'ember-websockets': {}
    };
  },

  _readConfigProp(prop) {
    this._shimImport();
    const config = this._readConfig(this._findHost().env);

    if (config['ember-websockets'] && config['ember-websockets'][prop]) {
      return config['ember-websockets'][prop];
    }
  },

  // https://github.com/simplabs/ember-simple-auth/blob/1ca4ae678b7be9905076762220dcd9fcb0f27ac0/index.js#L24-L39
  _shimImport() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
      this.import = function importShim(asset, options) {
        const app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};
