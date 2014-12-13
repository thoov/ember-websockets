import Ember from 'ember';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;
var originalWebSocket;
var webSocketServer;
var testRoute;
var testController;
var sampleData = 'This is a sample message';

module('Onopen, opmessage, and onclose intergration tests', {
    setup: function() {
        originalWebSocket = WebSocket;
        window.WebSocket = MockSocket;

        webSocketServer = new WebSocketServer('ws://localhost:8081/');
        webSocketServer.on('connection', function(server) {
            server.send(sampleData);
        });

        App = startApp();

        testRoute = App.__container__.lookup('route:sockets.test');
        testController = App.__container__.lookup('controller:sockets.test');
    },
    teardown: function() {
        window.WebSocket = originalWebSocket;
        Ember.run(App, App.destroy);
    }
});

test('Onopen event fires correct', function() {
    expect(2);

    testController.onopen = function(event) {
        ok(true, 'onopen event was fired and caught by a controller action');
        equal(event.type, 'open', 'event type is correct');
    };

    visit('/sockets/test');
});

test('Onmessage event fires correct', function() {
    expect(3);

    testController.onmessage = function(event) {
        ok(true, 'onmessage event was fired and caught by a controller action');
        equal(event.type, 'message', 'event type is correct');
        equal(event.data, sampleData, 'the data recieved is correct');
    };

    visit('/sockets/test');
});

test('Onclose event fires correct', function() {
    expect(2);

    testController.onclose = function(event) {
        ok(true, 'onclose event was fired and caught by a controller action');
        equal(event.type, 'close', 'event type is correct');
    };

    visit('/sockets/test').then(function() {
        testController.send('closeSocket');
    });
});

test('Onclose event fires on route deactivate', function() {
    expect(6);

    testController.onclose = function(event) {
        ok(true, 'onclose event was fired and caught by a controller action');
        equal(event.type, 'close', 'event type is correct');
    };

    // this will be called twice
    testController.onopen = function(event) {
        ok(true, 'onclose event was fired and caught by a controller action');
        equal(event.type, 'open', 'event type is correct');
    };

    visit('/sockets/test').then(function() {
        visit('/').then(function() {
            visit('/sockets/test');
        });
    });
});
