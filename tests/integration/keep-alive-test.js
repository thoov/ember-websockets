import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var App;
var originalWebSocket;
var mockServerA;
var mockServerB;
var testMultiController;
var testAliveController;

module('Keep alive tests', {
	setup: function() {
		originalWebSocket = WebSocket;
		window.WebSocket = MockSocket;

		App = startApp();

		mockServerA         = new MockServer('ws://localhost:8081/');
		mockServerB         = new MockServer('ws://localhost:8082/');
		testMultiController = App.__container__.lookup('controller:testing.multi-alive');
		testAliveController = App.__container__.lookup('controller:testing.alive');
	},
	teardown: function() {
		window.WebSocket = originalWebSocket;

		Ember.EnumerableUtils.forEach([testMultiController], function(controller) {
			Ember.EnumerableUtils.forEach(['onopen', 'onmessage', 'onclose', 'onerror'], function(method) {
				controller[method] = Ember.K;
			});
		});

		Ember.run(App, App.destroy);
	}
});

test('that setting keep alive will not close a socket', function(assert) {
	assert.expect(1);

	testAliveController.onopen = function(event) {
		assert.ok(true, 'onopen event was fired only once');
	};

	testAliveController.onclose = function(event) {
		assert.ok(false, 'onclose event will not fire as we set keep alive to true');
	};

	visit('/testing/alive').then(function() {
		visit('/').then(function() {
			visit('/testing/alive').then(function() {
				visit('/');
			});
		});
	});
});


test('that setting keep alive will not close a socket', function(assert) {
	assert.expect(7);

	// This should be called 3 times.
	testMultiController.onopen = function(event) {
		assert.ok(true, 'onopen event was fired only once');
	};

	// This should be called twice
	testMultiController.onclose = function(event) {
		assert.equal(event.origin, 'ws://localhost:8081/');
		assert.ok(true, 'onclose event will not fire as we set keep alive to true');
	};

	visit('/testing/multi-alive').then(function() {
		visit('/').then(function() {
			visit('/testing/multi-alive').then(function() {
				visit('/');
			});
		});
	});
});
