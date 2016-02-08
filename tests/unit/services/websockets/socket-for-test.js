import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

var component;
var ConsumerComponent;
var originalWebSocket;
var mockServerFoo;
var mockServerBar;

module('Sockets Service - socketFor', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket = window.MockWebSocket;

    var service = SocketsService.create();
    [mockServerFoo, mockServerBar] = [new window.MockServer('ws://example.com:7000/'), new window.MockServer('ws://example.com:7001/')]; // jshint ignore:line

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroy() {
        this.socketService.closeSocketFor('ws://example.com:7000/');
        this.socketService.closeSocketFor('ws://example.com:7001/');
      }
    });
  },
  teardown() {
    window.WebSocket = originalWebSocket;

    Ember.run(() => {
      component.destroy();
      mockServerFoo.close();
      mockServerBar.close();
    });
  }
});

test('that socketFor works correctly', assert => {
  var done = assert.async();
  assert.expect(2);

  component = ConsumerComponent.extend({
    init() {
      this._super.apply(this, arguments);
      var socketService = this.socketService;

      assert.deepEqual(socketService.socketFor('ws://example.com:7000/'), socketService.socketFor('ws://example.com:7000/'));
      assert.notDeepEqual(socketService.socketFor('ws://example.com:7000/'), socketService.socketFor('ws://example.com:7001/'));
      done();
    }
  }).create();
});
