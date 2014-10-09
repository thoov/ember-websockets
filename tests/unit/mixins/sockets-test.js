import Ember from 'ember';
import SocketsMixin from 'ember-sockets/mixins/sockets';

module('SocketsMixin');

// Replace this with your real tests.
test('it works', function() {
  var SocketsObject = Ember.Object.extend(SocketsMixin);
  var subject = SocketsObject.create();
  ok(subject);
});


test('websockets function gets called', function() {
    expect( 1 );
    stop();

    var SocketsRoute = Ember.Route.extend(SocketsMixin).create();
    var SocketsController = Ember.Controller.create();

    window.WebSocket = function() {
        console.log('here')

        ok(true);
        start();
    };

    SocketsRoute.setupController(SocketsController);
});
