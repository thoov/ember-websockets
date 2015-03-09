import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsMixin from 'ember-websockets/mixins/sockets';

module('Sockets Mixin');

test('validation of the socket url happens correctly', function(assert) {
    var emberObject = Ember.Object.createWithMixins(SocketsMixin);

    assert.expect(13);

    assert.ok(!emberObject.validateSocketConfigurations('ws://localhost:8080'));
    assert.ok(!emberObject.validateSocketConfigurations('wss://localhost:8080'));
    assert.ok(!emberObject.validateSocketConfigurations('http://localhost:8080'));
    assert.ok(!emberObject.validateSocketConfigurations('https://localhost:8080'));
    assert.ok(!emberObject.validateSocketConfigurations());
    assert.ok(!emberObject.validateSocketConfigurations(''));
    assert.ok(!emberObject.validateSocketConfigurations('foo-bar'));

    assert.ok(emberObject.validateSocketConfigurations([{socketURL: 'ws://localhost:8080'}]));
    assert.ok(emberObject.validateSocketConfigurations([{socketURL:'wss://localhost:8080'}]));
    assert.ok(emberObject.validateSocketConfigurations([{socketURL:'ws://localhost:8080'}, {socketURL:'wss://localhost:8080'}]));
    assert.ok(!emberObject.validateSocketConfigurations([{socketURL:'ws://localhost:8080'}, {socketURL:'https://localhost:8080'}]));
    assert.ok(!emberObject.validateSocketConfigurations([]));
    assert.ok(!emberObject.validateSocketConfigurations([{socketURL: ''}]));
});
