import Ember from 'ember';
import SocketsMixin from 'ember-websockets/mixins/sockets';

QUnit.config.testTimeout = 2000;

var TEST_SOCKET_URL = 'ws://localhost:8081';
var sockRoute, sockCntr;

module('SocketsMixin', {
    setup: function() {
        sockRoute = Ember.Route.extend(SocketsMixin, {
            socketURL: TEST_SOCKET_URL
        }).create();
    },
    teardown: function() {
        sockRoute.deactivate();
    }
});


test('setup of the mixin happens correctly during a route\'s setupController', function() {
    expect(4);

    sockCntr = Ember.Controller.extend({}).create();
    sockRoute.setupController(sockCntr);

    ok(sockRoute.get('socketConnection') instanceof window.WebSocket, 'socketConnection is of type WebSocket');
    strictEqual(sockRoute.get('socketContexts.' + sockRoute.get('socketURL')).filterBy('route', sockRoute).length, 1, 'socketContexts is setup correctly with the correct controller inside of it');
    strictEqual(sockRoute.get('keepSocketAlive'), null, 'keepSocketAlive is null by default');
    strictEqual(sockRoute.get('disableSocketConcurrency'), null, 'disableSocketConcurrency is null by default');
});

asyncTest('onopen event is fired and can be handled by a controller', function() {
    expect(2);

    sockCntr = Ember.Controller.extend({
        actions: {
            onopen: function(data) {

                ok(true, 'onopen event was fired and caught by a controller action');
                ok(data instanceof window.Event, 'data argument is an instance of Event');
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
                ok(data instanceof window.Event, 'data argument is an instance of Event');
                strictEqual(data.data, 'This is a sample message', 'data has expected text');
                start();
                //sockRoute._actions['emit'].call(sockRoute, 'testing');
            }
        }
    }).create();

    sockRoute.setupController(sockCntr);
});
