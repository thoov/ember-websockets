import Ember from 'ember';
import { module, test } from 'qunit';
import SocketsService from '../../../services/sockets';

module('Sockets Service');

test('validation of the socket url happens correctly', assert => {
	expect(4);
	stop();

	Ember.Component.extend({
		socketService: SocketsService.create(),
		socket: null,
		init() {
			this._super.apply(this, arguments);
			var socket = this.socketService.socketFor('ws://localhost:8080');

			socket.on('open', event => {
				assert.ok(true);
			});

			socket.on('message', event => {
				assert.ok(true);
			});

			socket.on('message', event => {
				assert.ok(true);
				socket.close();
			});

			socket.on('close', event => {
				assert.ok(true);
				start();
			});
		}
	}).create();
});
