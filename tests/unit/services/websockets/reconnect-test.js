import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

let component;
let mockServer;
let ConsumerComponent;
let originalWebSocket;
let service;

module('Sockets Service - reconnect tests', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket = window.MockWebSocket;

    service = SocketsService.create();
    mockServer = new window.MockServer('ws://example.com:7000/');

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroyElement() {
        this.socketService.closeSocketFor('ws://example.com:7000/');
      }
    });
  },
  teardown() {
    window.WebSocket = originalWebSocket;

    Ember.run(() => {
      component.destroy();
      service.destroy();
      mockServer.close();
    });
  }
});

test('that you can reopen a socket after it closes', assert => {
  var done = assert.async();
  var counter = 0;

  assert.expect(4);

  component = ConsumerComponent.extend({
    init() {
      this._super(...arguments);
      var socket = this.socketService.socketFor('ws://example.com:7000/');

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
