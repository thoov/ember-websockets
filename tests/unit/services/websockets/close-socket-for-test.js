import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

let component;
let ConsumerComponent;
let originalWebSocket;
let mockServer;
let service;

module('Sockets Service - closeSocketFor', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket = window.MockWebSocket;

    service = SocketsService.create();
    mockServer = new window.MockServer('ws://example.com:7000/');

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null
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

test('that closeSocketFor works correctly', assert => {
  var done = assert.async();
  assert.expect(1);

  component = ConsumerComponent.extend({
    init() {
      this._super(...arguments);
      const socketService = this.socketService.socketFor('ws://example.com:7000/');

      socketService.on('open', this.myOpenFunction, this);
      socketService.on('close', this.myCloseFunction, this);
    },

    myOpenFunction() {
      const socketService = this.socketService;
      socketService.closeSocketFor('ws://example.com:7000/');
    },

    myCloseFunction() {
      assert.ok(true);
      done();
    }
  }).create();
});
