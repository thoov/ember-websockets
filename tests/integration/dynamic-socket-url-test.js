import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var App;
var originalWebSocket;
var mockServer;
var mockServerB;
var dynamicController;
var dynamicRoute;

module('Dynamic socketURL tests', {
    setup: function() {
        originalWebSocket = WebSocket;
        window.WebSocket = MockSocket;

        App = startApp();

        mockServer        = new MockServer('ws://localhost:8080/room/1');
        mockServerB       = new MockServer('ws://localhost:8080/room/123');
        dynamicController = App.__container__.lookup('controller:testing.dynamic');
        dynamicRoute      = App.__container__.lookup('route:testing.dynamic');
    },
    teardown: function() {
        window.WebSocket = originalWebSocket;

        Ember.EnumerableUtils.forEach([dynamicController], function(controller) {
            Ember.EnumerableUtils.forEach(['onopen', 'onmessage', 'onclose', 'onerror'], function(method) {
                controller[method] = Ember.K;
            });
        });

        Ember.run(App, App.destroy);
    }
});

test('that dynamic route works as expected', function(assert) {
  assert.expect(4);

    dynamicController.onopen = function(event) {
      assert.ok(true, 'onopen event was fired');
    };
    dynamicController.onclose = function(event) {
      assert.ok(true, 'onclose event was fired');
    };

    visit('/testing/dynamic/1').then(function() {
        visit('/testing/dynamic/123').then(function() {
            visit('/');
        });
    });
});
