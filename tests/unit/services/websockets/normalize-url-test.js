import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from 'dummy/services/websockets';

var component;
var ConsumerComponent;

module('Sockets Service - normalizeURL', {
  setup() {
    var service       = SocketsService.create();
    ConsumerComponent = Ember.Component.extend({
      socketService: service
    });
  },
  teardown() {
    Ember.run(() => {
      component.destroy();
    });
  }
});

test('that normalizeURL works correctly', assert => {
  var done = assert.async();
  assert.expect(5);

  component = ConsumerComponent.extend({
    init() {
      this._super.apply(this, arguments);
      var socketService = this.socketService;

      assert.equal(socketService.normalizeURL('ws://localhost:8000'), 'ws://localhost:8000/');
      assert.equal(socketService.normalizeURL('ws://localhost:8000/'), 'ws://localhost:8000/');
      assert.equal(socketService.normalizeURL('ws://example.com'), 'ws://example.com/');
      assert.equal(socketService.normalizeURL('ws://example.com/foo'), 'ws://example.com/foo');
      assert.equal(socketService.normalizeURL('ws://example.com/foo/'), 'ws://example.com/foo/');

      done();
    }
  }).create();
});
