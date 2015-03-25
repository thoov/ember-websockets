import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from '../../../services/sockets';

module('Sockets Service');

test('validation of the socket url happens correctly', assert => {
  assert.expect(3);
  var done = assert.async();

  Ember.Component.extend({
    socketService: SocketsService.create(),
    socket: null,
    init() {
      this._super.apply(this, arguments);
      var socket = this.socketService.socketFor('ws://localhost:8080');

      socket.on('open', this.myOpenHandler);
      socket.on('message', this.myMessageHandler, this);
      socket.on('close', this.myCloseHandler);

      this.socket = socket;
    },

    willDestroy() {
      this._super.apply(this, arguments);

      this.socket.off('open', this.myOpenHandler);
      this.socket.off('message', this.myMessageHandler);
      this.socket.off('close', this.myCloseHandler);
    },

    myOpenHandler(event) {
      assert.ok(true);
    },

    myMessageHandler(event) {
      assert.ok(true);
      this.socket.close();
    },

    myCloseHandler(event) {
      assert.ok(true);
      done();
    }

  }).create();
});
