import Ember from 'ember';
import SocketsMixin from 'ember-sockets/mixins/sockets';

var webSocketFunction;

module('SocketsMixin', {
  setup: function() {
    webSocketFunction = window.WebSocket;
    window.WebSocket = function() {
      ok(true);
      start();
    };
  },
  teardown: function() {
    window.WebScoket = webSocketFunction;
  }
});


asyncTest('the route setup happens correctly during setupController', function() {
    var socketsRoute, socketsController;

    expect(3);

    socketsRoute = Ember.Route.extend(SocketsMixin, {
        socketURL: 'ws://localhost:8080'
    }).create(),

    socketsController = Ember.Controller.extend({}).create();

    socketsRoute.setupController(socketsController);

    ok(Ember.typeOf(socketsRoute.get('socketConnection')) === 'object');
    ok(socketsRoute.get('socketConnection') instanceof window.WebSocket);
});


asyncTest('the route setup happens correctly during setupController', function() {
    var socketsRoute, socketsController;

    expect(3);

    socketsRoute = Ember.Route.extend(SocketsMixin, {
        socketURL: 'ws://localhost:8080'
    }).create(),

    socketsController = Ember.Controller.extend({
      actions: {
        onopen: function() {
          ok(true)
          start();
        }
      }

    }).create();

    socketsRoute.setupController(socketsController);

    socketsRoute.get('socketConnection').open


    ok(Ember.typeOf(socketsRoute.get('socketConnection')) === 'object');
    ok(socketsRoute.get('socketConnection') instanceof window.WebSocket);
});
