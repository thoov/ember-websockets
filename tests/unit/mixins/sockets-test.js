import Ember from 'ember';
import SocketsMixin from 'ember-sockets/mixins/sockets';

var webSocketFunction;

module('SocketsMixin', {
  setup: function() {},
  teardown: function() {}
});


asyncTest('the route setup happens correctly during setupController', function() {
    var socketsRoute,
        socketsController;

    expect(2);

    socketsRoute = Ember.Route.extend(SocketsMixin, {
        socketURL: 'ws://localhost:8080'
    }).create();

    socketsController = Ember.Controller.extend({}).create();

    socketsRoute.setupController(socketsController);

    ok(Ember.typeOf(socketsRoute.get('socketConnection')) === 'object');
    ok(socketsRoute.get('socketConnection') instanceof window.WebSocket);

    start();
});
