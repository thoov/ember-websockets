import Ember from 'ember';
import SocketsMixin from 'ember-websockets/mixins/sockets';

module('Sockets Mixin');

test('validation of the socket url happens correctly', function() {
    var emberObject = Ember.Object.createWithMixins(SocketsMixin);

    expect(12);

    ok(emberObject.validateSocketURL('ws://localhost:8080'));
    ok(emberObject.validateSocketURL('wss://localhost:8080'));
    ok(!emberObject.validateSocketURL('http://localhost:8080'));
    ok(!emberObject.validateSocketURL('https://localhost:8080'));
    ok(!emberObject.validateSocketURL());
    ok(!emberObject.validateSocketURL(''));
    ok(!emberObject.validateSocketURL('foo-bar'));

    ok(emberObject.validateSocketURL(['ws://localhost:8080']));
    ok(emberObject.validateSocketURL(['wss://localhost:8080']));
    ok(emberObject.validateSocketURL(['ws://localhost:8080', 'wss://localhost:8080']));
    ok(!emberObject.validateSocketURL(['ws://localhost:8080', 'https://localhost:8080']));
    ok(!emberObject.validateSocketURL([]));
});
