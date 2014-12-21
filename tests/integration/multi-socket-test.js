import Ember from 'ember';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;
var originalWebSocket;
var mockServerA;
var mockServerB;
var testMultiRoute;
var testMultiController;
var sampleData = 'This is a sample message';

module('Onopen, opmessage, and onclose intergration tests for multiple sockets', {
    setup: function() {
        App                 = startApp();
        originalWebSocket   = WebSocket;
        window.WebSocket    = MockSocket;
        mockServerA         = new MockServer('ws://localhost:8081/');
        mockServerB         = new MockServer('ws://localhost:8082/');
        testMultiRoute      = App.__container__.lookup('route:testing.multi');
        testMultiController = App.__container__.lookup('controller:testing.multi');
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

test('Onopen will fire for each socket', function() {
    expect(2);

    testMultiController.onopen = function(event) {
        ok(true, 'onopen event was fired and caught by a controller action');
    };

    visit('/testing/multi').then(function() {
        visit('/');
    });
});

test('Onclose will fire for each socket', function() {
    expect(2);

    testMultiController.onclose = function(event) {
        ok(true, 'onclose event was fired and caught by a controller action');
    };

    visit('/testing/multi').then(function() {
        visit('/');
    });
});

test('Can close just a single connection', function() {
    var semaphore = 0;

    expect(2);

    testMultiController.onclose = function(event) {
        semaphore++;
        if(semaphore === 1) {
            equal(event.origin, 'ws://localhost:8082/', '');
        }
        else {
            equal(event.origin, 'ws://localhost:8081/', '');

            // This will transition away which will fire the deactivate function.
            // It should not call the onclose method as we have close all of the
            // connections.
            visit('/');
        }
    };

    visit('/testing/multi').then(function() {
        testMultiController.send('closeSocket', 'socket2');
        testMultiController.send('closeSocket', 'socket1');
    });
});
