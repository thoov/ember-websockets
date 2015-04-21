import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from '../../../../services/websockets';

var component;
var mockServer;
var ConsumerComponent;
var originalWebSocket;

module('Sockets Service - reconnect tests', {
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

test('that you can reopen a socket after it closes', assert => {
  var done = assert.async();
  var counter = 0;

  assert.expect(4);

  component = ConsumerComponent.extend({
    init() {
      this._super.apply(this, arguments);
      var socket = this.socketService.socketFor('ws://localhost:7000/');

      socket.on('open', () => {
        assert.ok(true);
        socket.close();
      }, this);

      socket.on('close', () => {
        assert.ok(true);
        if(counter === 0) { socket.reconnect(); }
        else { done(); }
        counter++;
      }, this);

      this.socket = socket;
    }
  }).create();
});
