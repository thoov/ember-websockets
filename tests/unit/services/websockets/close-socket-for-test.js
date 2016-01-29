import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

var component;
var ConsumerComponent;
var originalWebSocket;
var mockServerFoo;
var mockServerBar;

module('Sockets Service - closeSocketFor', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket = window.MockWebSocket;

    const service = SocketsService.create();
    [mockServerFoo, mockServerBar] = [new window.MockServer('ws://localhost:7000/'), new window.MockServer('ws://localhost:7001/')]; // jshint ignore:line

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroy() {
        this.socketService.closeSocketFor('ws://localhost:7000/');
        this.socketService.closeSocketFor('ws://localhost:7001/');
      }
    });
  },
  teardown() {
    window.WebSocket = originalWebSocket;

    Ember.run(() => {
      mockServerFoo.close();
      mockServerBar.close();
    });
  }
});

test('that closeSocketFor works correctly', assert => {
  const done = assert.async();
  assert.expect(5);

  component = ConsumerComponent.extend({
    init() {
      this._super(...arguments);
      const socketService = this.socketService;

      assert.equal(Object.keys(socketService.sockets).length, 0);
      socketService.socketFor('ws://localhost:7000/');
      assert.equal(Object.keys(socketService.sockets).length, 1);

      socketService.socketFor('ws://localhost:7001/');
      assert.equal(Object.keys(socketService.sockets).length, 2);

      socketService.closeSocketFor('ws://localhost:7000/');
      assert.equal(Object.keys(socketService.sockets).length, 1);

      socketService.closeSocketFor('ws://localhost:7001/');
      assert.equal(Object.keys(socketService.sockets).length, 0);

      done();
    }
  }).create();
});
