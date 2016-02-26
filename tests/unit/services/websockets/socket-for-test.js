import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

let component;
let ConsumerComponent;
let originalWebSocket;
let mockServerFoo;
let mockServerBar;
let service;

module('Sockets Service - socketFor', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket = window.MockWebSocket;

    service = SocketsService.create();
    [mockServerFoo, mockServerBar] = [new window.MockServer('ws://example.com:7000/'), new window.MockServer('ws://example.com:7001/')]; // jshint ignore:line

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroyElement() {
        this.socketService.closeSocketFor('ws://example.com:7000/');
        this.socketService.closeSocketFor('ws://example.com:7001/');
      }
    });
  },
  teardown() {
    window.WebSocket = originalWebSocket;

    Ember.run(() => {
      component.destroy();
      service.destroy();
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
      this._super(...arguments);
      var socketService = this.socketService;

      assert.deepEqual(socketService.socketFor('ws://example.com:7000/'), socketService.socketFor('ws://example.com:7000/'));
      assert.notDeepEqual(socketService.socketFor('ws://example.com:7000/'), socketService.socketFor('ws://example.com:7001/'));
      done();
    }
  }).create();
});
