import Ember from 'ember';
import ENUMS from '../utils/enums';

var typeOf = Ember.typeOf;

export default Ember.Mixin.create({

	socketURL: null,
	socketContexts: {}, // This is shared between route instances.
	keepSocketAlive: null,
	socketConnection: null,

	setupController: function(controller) {
		var urlHashKey,
			socketURL = this.get('socketURL'),
			websocket = this.get('socketConnection'),
			socketContexts = this.get('socketContexts');

		if(!this.validateSocketURL(socketURL)) {
			this._super.apply(this, arguments);
			return false;
		}

		/*
			Initialize the socket if it is null or has been closed.
			If the ready state is closed this is because the route closed the socket on a previous
			deactivate and now we are back into this same route so we need to reopen (create) it.
		*/
		if(!websocket || websocket.readyState === ENUMS.READY_STATES.CLOSED) {
			websocket = new window.WebSocket(socketURL);
			urlHashKey = websocket.url;

			// This will only fire if the urlHashKey has added an extra / to the end of the url. This will only
			// happen if your socketURL is at the rootLevel such as ws://example.com or ws://localhost:8080 in which the
			// the urlHashKey will be ws://example.com/ and ws://localhost:8080/ respectfully.
			this.set('socketURL', urlHashKey);

			// If we dont have the hashKey in our shared object this means we are creating the first socket for a given
			// url
			if(!socketContexts[urlHashKey]) {
				socketContexts[urlHashKey] = [];
			}

			socketContexts[urlHashKey].pushObject({controller: controller, route: this});
			this.set('socketConnection', this.initializeSocket(websocket, socketContexts));
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
	initializeSocket: function(websocket, socketContexts) {
		ENUMS.SOCKET_EVENTS.forEach(function(eventName) {
			websocket[eventName] = function(data) {
				socketContexts[data.currentTarget.url].forEach(function(context) {
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

		Ember.Logger.log('SocketURL is missing or is not correctly setup');
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
			if(this.get('socketConnection')) {
				this.get('socketConnection').close();
				this.set('socketConnection', null);
				socketContexts[socketURL] = socketContexts[socketURL].rejectBy('route', this);
			}
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
