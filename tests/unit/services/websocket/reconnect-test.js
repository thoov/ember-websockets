import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from '../../../../services/websockets';

var component;
var ConsumerComponent;
var originalWebSocket;
var mockServer;
var service = SocketsService.create();

module('Sockets Service - reconnect tests', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket  = MockSocket;

    // setup the mock server so each test will connect to it
    mockServer = new MockServer('ws://localhost:7111/');

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroy() {
        this.socketService.closeSocketFor('ws://localhost:7111/');
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
      var socket = this.socketService.socketFor('ws://localhost:7111/');

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
