import Ember from 'ember';
import WebsocketProxy from 'ember-websockets/helpers/websocket-proxy';

export default Ember.Service.extend({

	/*
	* Each element in the array is of form:
	*
	* {
	*		url: 'string'
	*		socket: WebSocket Proxy object
	*	}
	*/
	sockets: [],

	socketFor(URL) {
		var proxy = this.get('sockets').findBy('url', URL); // TODO: need to normalize the url

		if (proxy) { return proxy; }

		proxy = WebsocketProxy.create({
			content: this,
			socket: new WebSocket(URL)
		});

		this.get('sockets').pushObject({
			url: proxy.socket.url,
			socket: proxy
		});

		return proxy;
	}
});
