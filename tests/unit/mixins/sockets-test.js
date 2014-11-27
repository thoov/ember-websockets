import Ember from 'ember';
import SocketsMixin from 'ember-websockets/mixins/sockets';

QUnit.config.testTimeout = 2000;

var sockCntr;
var sockRoute;
var originalWebSocket;
var webSocketServer;
var TEST_SOCKET_URL = 'ws://localhost:8081/';

module('SocketsMixin', {
    setup: function() {
        originalWebSocket = window.WebSocket;
        window.WebSocket = window.MockSocket;

        webSocketServer = new window.WebSocketServer('ws://localhost:8081/');
        webSocketServer.on('connection', function(server) {
            server.send('This is a sample message');
        });

        sockRoute = Ember.Route.extend(SocketsMixin, {
            socketURL: TEST_SOCKET_URL
        }).create();
    },
    teardown: function() {
        sockRoute.deactivate();
        window.WebSocket = originalWebSocket;

        sockCntr = null;
        sockRoute = null;
    }
});

asyncTest('setup of the mixin happens correctly during a route\'s setupController', function() {
    expect(4);

    sockCntr = Ember.Controller.extend({
        actions: {
            onopen: function() {
                ok(sockRoute.get('socketConnection') instanceof window.WebSocket, 'socketConnection is of type WebSocket');
                strictEqual(sockRoute.get('socketContexts.' + sockRoute.get('socketURL')).filterBy('route', sockRoute).length, 1, 'socketContexts is setup correctly with the correct controller inside of it');
                strictEqual(sockRoute.get('keepSocketAlive'), null, 'keepSocketAlive is null by default');
                strictEqual(sockRoute.get('socketURL'), 'ws://localhost:8081/', 'the socketURL has been changed to reflect the urlHashKey ie: a slash has been added');
                start();
            }
        }
    }).create();
    sockRoute.setupController(sockCntr);
});

test('validation of the socket url happens correctly', function() {
    expect(7);

    ok(sockRoute.validateSocketURL('ws://localhost:8080'));
    ok(sockRoute.validateSocketURL('wss://localhost:8080'));
    ok(!sockRoute.validateSocketURL('http://localhost:8080'));
    ok(!sockRoute.validateSocketURL('https://localhost:8080'));
    ok(!sockRoute.validateSocketURL());
    ok(!sockRoute.validateSocketURL(''));
    ok(!sockRoute.validateSocketURL('foo-bar'));
});

asyncTest('onopen event is fired and can be handled by a controller', function() {
    expect(2);

    sockCntr = Ember.Controller.extend({
        actions: {
            onopen: function(data) {
                ok(true, 'onopen event was fired and caught by a controller action');
                ok(typeof data === 'object', 'data argument is an instance of Event');

                start();
            }
        }
    }).create();

    sockRoute.setupController(sockCntr);
});


asyncTest('onmessage event is fired and can be handled by a controller', function() {
    expect(3);

    sockCntr = Ember.Controller.extend({
        actions: {
            onmessage: function(data) {
                ok(true, 'onmessage event was fired and caught by a controller action');
                ok(typeof data === 'object', 'data argument is an instance of Event');
                strictEqual(data.data, 'This is a sample message', 'data has expected text');
                start();
            }
        }
    }).create();

    sockRoute.setupController(sockCntr);
});
