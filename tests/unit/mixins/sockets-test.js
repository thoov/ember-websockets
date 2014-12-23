import Ember from 'ember';
import SocketsMixin from 'ember-websockets/mixins/sockets';

module('Sockets Mixin');

test('validation of the socket url happens correctly', function() {
    var emberObject = Ember.Object.createWithMixins(SocketsMixin);

    expect(13);

    ok(!emberObject.validateSocketConfigurations('ws://localhost:8080'));
    ok(!emberObject.validateSocketConfigurations('wss://localhost:8080'));
    ok(!emberObject.validateSocketConfigurations('http://localhost:8080'));
    ok(!emberObject.validateSocketConfigurations('https://localhost:8080'));
    ok(!emberObject.validateSocketConfigurations());
    ok(!emberObject.validateSocketConfigurations(''));
    ok(!emberObject.validateSocketConfigurations('foo-bar'));

    ok(emberObject.validateSocketConfigurations([{socketURL: 'ws://localhost:8080'}]));
    ok(emberObject.validateSocketConfigurations([{socketURL:'wss://localhost:8080'}]));
    ok(emberObject.validateSocketConfigurations([{socketURL:'ws://localhost:8080'}, {socketURL:'wss://localhost:8080'}]));
    ok(!emberObject.validateSocketConfigurations([{socketURL:'ws://localhost:8080'}, {socketURL:'https://localhost:8080'}]));
    ok(!emberObject.validateSocketConfigurations([]));
    ok(!emberObject.validateSocketConfigurations([{socketURL: ''}]));
});
