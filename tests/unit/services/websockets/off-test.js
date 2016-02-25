import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

let component;
let mockServer;
let ConsumerComponent;
let originalWebSocket;
let service;

module('Sockets Service - off(*) tests', {
  setup() {
    originalWebSocket = window.WebSocket;
    window.WebSocket = window.MockWebSocket;

    service = SocketsService.create();
    mockServer = new window.MockServer('ws://example.com:7000/');

    ConsumerComponent = Ember.Component.extend({
      socketService: service,
      socket: null,
      willDestroy() {
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

test('that off(close) works correctly', assert => {
  var done = assert.async();
  assert.expect(1);

  let myCloseHandlerRef;

  component = ConsumerComponent.extend({
    init() {
      this._super(...arguments);
      var socket = this.socketService.socketFor('ws://example.com:7000/');

      myCloseHandlerRef = this.myCloseHandler.bind(this);
      socket.on('open', this.myOpenHandler.bind(this));
      socket.on('close', myCloseHandlerRef);

      this.socket = socket;

      Ember.run.later(() => {
        done();
      }, 250);
    },

    myOpenHandler() {
      assert.ok(true);
      this.socket.off('close', myCloseHandlerRef);
      this.socket.close();
    },

    myCloseHandler() {
      assert.ok(false); // this should not be called
    }
  }).create();
});
