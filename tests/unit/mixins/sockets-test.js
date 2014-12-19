import Ember from 'ember';
import SocketsMixin from 'ember-websockets/mixins/sockets';

module('Sockets Mixin');

test('validation of the socket url happens correctly', function() {
    var emberObject = Ember.Object.createWithMixins(SocketsMixin);

    expect(13);

    ok(!emberObject.validateSocketURL('ws://localhost:8080'));
    ok(!emberObject.validateSocketURL('wss://localhost:8080'));
    ok(!emberObject.validateSocketURL('http://localhost:8080'));
    ok(!emberObject.validateSocketURL('https://localhost:8080'));
    ok(!emberObject.validateSocketURL());
    ok(!emberObject.validateSocketURL(''));
    ok(!emberObject.validateSocketURL('foo-bar'));

    ok(emberObject.validateSocketURL([{url: 'ws://localhost:8080'}]));
    ok(emberObject.validateSocketURL([{url:'wss://localhost:8080'}]));
    ok(emberObject.validateSocketURL([{url:'ws://localhost:8080'}, {url:'wss://localhost:8080'}]));
    ok(!emberObject.validateSocketURL([{url:'ws://localhost:8080'}, {url:'https://localhost:8080'}]));
    ok(!emberObject.validateSocketURL([]));
    ok(!emberObject.validateSocketURL([{url: ''}]));
});
