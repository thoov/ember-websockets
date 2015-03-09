import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var App;
var originalWebSocket;
var mockServer;
var testRoute;
var testController;
var sampleData = 'This is a sample message';

module('Onopen, opmessage, and onclose intergration tests', {
    setup: function() {
        originalWebSocket = WebSocket;
        window.WebSocket  = MockSocket;

        mockServer = new MockServer('ws://localhost:8081/');
        mockServer.on('connection', function(server) {
            server.send(sampleData);
        });

        App = startApp();

        testRoute      = App.__container__.lookup('route:testing.foo');
        testController = App.__container__.lookup('controller:testing.foo');
    },
    teardown: function() {
        window.WebSocket = originalWebSocket;
        Ember.EnumerableUtils.forEach([testController], function(controller) {
            Ember.EnumerableUtils.forEach(['onopen', 'onmessage', 'onclose', 'onerror'], function(method) {
                controller[method] = Ember.K;
            });
        });
        Ember.run(App, App.destroy);
    }
});

test('Onopen event fires correct', function(assert) {
  assert.expect(2);

    testController.onopen = function(event) {
      assert.ok(true, 'onopen event was fired and caught by a controller action');
      assert.equal(event.type, 'open', 'event type is correct');
    };

    visit('/testing/foo');
});

test('Onmessage event fires correct', function(assert) {
  assert.expect(3);

    testController.onmessage = function(event) {
      assert.ok(true, 'onmessage event was fired and caught by a controller action');
      assert.equal(event.type, 'message', 'event type is correct');
      assert.equal(event.data, sampleData, 'the data recieved is correct');
    };

    visit('/testing/foo');
});

test('Onclose event fires correct', function(assert) {
  assert.expect(2);

    testController.onclose = function(event) {
      assert.ok(true, 'onclose event was fired and caught by a controller action');
      assert.equal(event.type, 'close', 'event type is correct');

        visit('/');
    };

    visit('/testing/foo').then(function() {
        testController.send('closeSocket');
    });
});

test('Onclose event fires on route resetController', function(assert) {
  assert.expect(4);

    // the onclose method should be called twice once for both /sockets/test "route resetController"
    testController.onclose = function(event) {
      assert.ok(true, 'onclose event was fired and caught by a controller action');
      assert.equal(event.type, 'close', 'event type is correct');
    };

    visit('/testing/foo').then(function() {
        visit('/').then(function() {
            visit('/testing/foo').then(function() {
                visit('/');
            });
        });
    });
});
