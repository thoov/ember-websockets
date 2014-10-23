import Ember from 'ember';
import ENUMS from '../utils/enums';

var typeOf = Ember.typeOf;

export default Ember.Mixin.create({

	socketURL: null,
	socketContexts: {}, // This is shared between route instances.
	keepSocketAlive: null,
	socketConnection: null,

	setupController: function(controller) {

		var socketURL = this.get('socketURL'),
			socketEventListeners = ['onclose', 'onerror', 'onmessage', 'onopen'],
			websocket = this.get('socketConnection'),
			socketContexts = this.get('socketContexts');

		if(this.validateSocketURL(socketURL)) {
			this._super.apply(this, arguments);
			return false;
		}

		/*
			Initialize the socket
		*/
		if(!websocket || websocket.readyState === ENUMS.READY_STATES.CLOSED) {
			if(socketContexts[socketURL]) {
				socketContexts[socketURL].pushObject({controller: controller, route: this});
			}
			else {
				socketContexts[socketURL] = [{controller: controller, route: this}];
			}

			websocket = new window.WebSocket(socketURL);
			this.set('socketConnection', this.initializeSocket(websocket, socketEventListeners, socketContexts));
		}

		/*
			Make sure that we call the super function just in case the object
			who is using this mixin will have their activate function called.
		*/
		this._super.apply(this, arguments);
	},

	/*
		Overrides the onopen, onmessage, etc methods that get envoked on the socket.
		This methods will instead send an action and pass along the data coming back.
	*/
	initializeSocket: function(websocket, socketEventListeners, socketContexts) {
		socketEventListeners.forEach(function(eventName) {
			websocket[eventName] = function(data) {
				socketContexts[data.currentTarget.url.split('').slice(0, -1).join('')].forEach(function(context) {
					context.controller.send(eventName, data);
				});
			};
		});

		return websocket;
	},

	/*
		Validates that the socketURL is set and contains a valid ws or wss protocal url
	*/
	validateSocketURL: function(socketURL) {
		var wsProtocolRegex = /(ws|wss):\/\//i;

		if(!Ember.isEmpty(socketURL) && socketURL.match(wsProtocolRegex)) {
			return true;
		}

		Ember.Logger.log('SocketURL is missing or is not correctly setup: ', socketURL);
		return false;
	},

	/*
		When the route deactivates or "transitions away" we will either close the
		connection or keep it "alive"
	*/
	deactivate: function() {
		this._super.apply(this, arguments);
		var keepSocketAlive = this.get('keepSocketAlive'),
			socketContexts = this.get('socketContexts'),
			socketURL = this.get('socketURL');

		if(keepSocketAlive === false || typeOf(keepSocketAlive) === 'null') {
			this.get('socketConnection').close();
			this.set('socketConnection', null);
			socketContexts[socketURL] = socketContexts[socketURL].rejectBy('route', this);
		}
	},

	actions: {
		/*
			This is an action that controllers, components, view, etc can send
			which will make its way to the
		*/
		emit: function(data, shouldStringify) {

			if(shouldStringify && JSON && JSON.stringify) {
				data = JSON.stringify(data);
			}

			this.get('socketConnection').send(data);
		},

		/*
			These are just catch alls so we do not get the error message: 'nothing
			handled this action...'. These should be overridden by the controller.
		*/
		onmessage: Ember.K,
		onerror: Ember.K,
		onopen: Ember.K,
		onclose: Ember.K
	}
});
