import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var App;
var originalWebSocket;
var mockServer;
var testFooRoute;
var testBarRoute;
var testFooController;
var testBarController;

module('Onopen, opmessage, and onclose intergration tests for multiple routes', {
  setup: function() {
    originalWebSocket = WebSocket;
    window.WebSocket  = MockSocket;
    mockServer        = new MockServer('ws://localhost:8081/');

    App               = startApp();
    testFooRoute      = App.__container__.lookup('route:testing.foo');
    testBarRoute      = App.__container__.lookup('route:testing.bar');
    testFooController = App.__container__.lookup('controller:testing.foo');
    testBarController = App.__container__.lookup('controller:testing.bar');
  },
  teardown: function() {
    window.WebSocket = originalWebSocket;

    Ember.EnumerableUtils.forEach([testFooController, testBarController], function(controller) {
      Ember.EnumerableUtils.forEach(['onopen', 'onmessage', 'onclose', 'onerror'], function(method) {
        controller[method] = Ember.K;
      });
    });

    Ember.run(App, App.destroy);
  }
});

test('Onopen and onclose will fire for each route visited', function(assert) {
  assert.expect(4);

  testFooController.onopen = function(event) {
    assert.ok(true, 'onopen event was fired and caught by a controller action');
  };

  testFooController.onclose = function(event) {
      assert.ok(true, 'onclose event was fired and caught by a controller action');
  };

  testBarController.onopen = function(event) {
      assert.ok(true, 'onopen event was fired and caught by a controller action');
  };

  testBarController.onclose = function(event) {
      assert.ok(true, 'onclose event was fired and caught by a controller action');
  };

  visit('/testing/foo').then(function() {
    visit('/testing/bar').then(function() {
      visit('/');
    });
  });
});
