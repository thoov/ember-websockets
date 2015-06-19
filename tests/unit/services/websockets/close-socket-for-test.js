import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

var component;
var ConsumerComponent;
var originalWebSocket;

module('Sockets Service - closeSocketFor', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket  = MockSocket;

    var service       = SocketsService.create();
    var mockSockets   = [new MockServer('ws://localhost:7000/'), new MockServer('ws://localhost:7001/')];

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
      component.destroy();
    });
  }
});

test('that closeSocketFor works correctly', assert => {
  var done = assert.async();
  assert.expect(5);

  component = ConsumerComponent.extend({
    init() {
      this._super.apply(this, arguments);
      var socketService = this.socketService;

      assert.equal(socketService.sockets.length, 0);
      socketService.socketFor('ws://localhost:7000/');
      assert.equal(socketService.sockets.length, 1);

      socketService.socketFor('ws://localhost:7001/');
      assert.equal(socketService.sockets.length, 2);

      socketService.closeSocketFor('ws://localhost:7000/');
      assert.equal(socketService.sockets.length, 1);

      socketService.closeSocketFor('ws://localhost:7001/');
      assert.equal(socketService.sockets.length, 0);

      done();
    }
  }).create();
});
