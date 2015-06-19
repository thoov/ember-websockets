import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

var component;
var mockServer;
var ConsumerComponent;
var originalWebSocket;

module('Sockets Service - off(*) tests', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket  = MockSocket;

    var service       = SocketsService.create();
    mockServer        = new MockServer('ws://localhost:7000/');

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroy() {
        this.socketService.closeSocketFor('ws://localhost:7000/');
      }
    });
  },
  teardown() {
    window.WebSocket = originalWebSocket;

    Ember.run(() => {
      component.destroy();
    });
  }
});

test('that off(close) works correctly', assert => {
  var done = assert.async();
  assert.expect(1);

  component = ConsumerComponent.extend({
    init() {
      this._super.apply(this, arguments);
      var socket = this.socketService.socketFor('ws://localhost:7000/');

      socket.on('open', this.myOpenHandler, this);
      socket.on('close', this.myCloseHandler, this);

      this.socket = socket;

      Ember.run.later(() => {
        done();
      }, 250);
    },

    myOpenHandler(event) {
      assert.ok(true);
      this.socket.off('close', this.myCloseHandler);
      this.socket.close();
    },

    myCloseHandler(event) {
      assert.ok(false); // this should not be called
    }
  }).create();
});
