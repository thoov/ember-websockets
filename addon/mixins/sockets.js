import Ember from 'ember';

var typeOf       = Ember.typeOf;
var isEmpty      = Ember.isEmpty;
var socketEvents = ['onclose', 'onerror', 'onmessage', 'onopen'];
var forEach      = Ember.EnumerableUtils.forEach;

export default Ember.Mixin.create({

	socketURL            : null,
	socketContexts       : {}, // This is shared between all route instances.
	keepSocketAlive      : null,
	socketBinaryType     : null,
	socketConnections    : null,
	socketConfigurations : null,

	setupController: function(controller) {
		var socketConnections    = [];
		var socketURL            = this.get('socketURL');
		var socketContexts       = this.get('socketContexts');
		var socketBinaryType     = this.get('socketBinaryType');
		var socketConfigurations = this.get('socketConfigurations');

		/*
		* Normalize the single and multi socket configs into one so we can
		* just loop over an array in both cases. IE: a single socket is just
		* an array of one item.
		*/
		if(isEmpty(socketConfigurations)) {
			socketConfigurations = [{url: socketURL, binaryType: socketBinaryType}];
		}

		/*
		* Make sure that all of the urls in the configuration are set and valid.
		*/
		if(!this.validateSocketURL(socketConfigurations)) {
			this._super.apply(this, arguments);
			return false;
		}

		/*
		* Setup each socket connection if it needs to be setup.
		*/
		forEach(socketConfigurations, function(socketConfig) {
			var urlHashKey       = '';
			var socketURL        = socketConfig.url;
			var websocket        = socketConnections[socketURL];
			var socketBinaryType = socketConfig.socketBinaryType || 'blob';

			if(!websocket || websocket.readyState === window.WebSocket.CLOSED) {
				websocket            = new window.WebSocket(socketURL);
				websocket.binaryType = socketBinaryType;
				urlHashKey           = websocket.url;

				// If we dont have the hashKey in our shared object this means we
				// are creating the first socket for a given url
				if(!socketContexts[urlHashKey]) {
					socketContexts[urlHashKey] = [];
				}

				this.removeRouteFromContexts(socketContexts, urlHashKey, this); // TODO: can we remove this?
				socketContexts[urlHashKey].pushObject({controller: controller, route: this});

				socketConnections.push(this.initializeSocket(websocket, socketContexts));
			}
			else {
				socketConnections.push(websocket);
			}
		}, this);

		this.set('socketConnections', socketConnections);

		/*
		* Make sure that we call the super function just in case the object
		* who is using this mixin will have their activate function called.
		*/
		this._super.apply(this, arguments);
	},

	/*
		Overrides the onopen, onmessage, etc methods that get envoked on the socket.
		This methods will instead send an action and pass along the data coming back.
	*/
	initializeSocket: function(websocket, socketContexts) {
		forEach(socketEvents, function(eventName) {
			websocket[eventName] = function(data) {
				socketContexts[data.currentTarget.url].forEach(function(context) {

					// Only fire the action on the socket we care about.
					if(context.route.socketConnections.contains(data.target)) {
						context.controller.send(eventName, data);
					}
				});
			};
		});

		return websocket;
	},

	/*
		Validates that an array of socketURLs is set and contains a valid ws or wss protocal url.
	*/
	validateSocketURL: function(arrayOfURLs) {
		var wsProtocolRegex = /^(ws|wss):\/\//i;
		var urlsAreValid    = true;

		if(isEmpty(arrayOfURLs) || typeOf(arrayOfURLs) !== 'array') {
			return false;
		}

		forEach(arrayOfURLs, function(socketConfig) {
			var url = socketConfig.url;

			if(isEmpty(url) || !url.match(wsProtocolRegex)) {
				urlsAreValid = false;
			}
		});

		return urlsAreValid;
	},

	removeRouteFromContexts: function(socketContexts, socketURL, route) {
		if(socketContexts[socketURL] && socketContexts[socketURL].length > 0) {
			socketContexts[socketURL] = socketContexts[socketURL].rejectBy('route', route);
			return true;
		}

		return false;
	},

	/*
		When the route deactivates or "transitions away" we will either close the
		connection or keep it "alive"
	*/
	deactivate: function() {
		var keepSocketAlive  = this.get('keepSocketAlive');
		var socketConnections = this.get('socketConnections');
		var socketConfigurations = this.get('socketConfigurations');

		/*
		* Normalize the single and multi socket configs into one so we can
		* just loop over an array in both cases. IE: a single socket is just
		* an array of one item.
		*/
		if(!isEmpty(socketConfigurations)) {
			forEach(socketConnections, function(connection) {
				if(!connection.keepSocketAlive) {
					if(connection && typeOf(connection.close) === 'function') {
						connection.close();
					}
				}
			});
		}
		else {
			// By default within deactivate we will close the connection. If keepSocketAlive
			// is set to true then we will skip this and the socket will not be closed.
			if(!keepSocketAlive) {
				if(socketConnections[0] && typeOf(socketConnections[0].close) === 'function') {
					socketConnections[0].close();
				}
			}
		}

		this._super.apply(this, arguments);
	},

	actions: {
		/*
			This is an action that controllers, components, view, etc can send
			which will make its way to the
		*/
		emit: function(data, shouldStringify) {
			var socketConnection = this.get('socketConnection');

			if(shouldStringify && JSON && JSON.stringify) {
				data = JSON.stringify(data);
			}

			// Only send the data if we have an active connection
			if(socketConnection && typeOf(socketConnection.send) === 'function' && socketConnection.readyState === window.WebSocket.OPEN) {
				socketConnection.send(data);
			}
		},

		/*
			This action closes the websocket connection.
			TODO: right now this will close all of your connections. Need to add the ability
			to close a single connection.
		*/
		closeSocket: function() {
			var socketConnections = this.get('socketConnections');
			forEach(socketConnections, function(connection) {
				if(connection && typeOf(connection.close) === 'function') {
					connection.close();
				}
			});
		},

		/*
			These are just catch alls so we do not get the error message: 'nothing
			handled this action...'. These should be overridden by the controller.
		*/
		onmessage : Ember.K,
		onerror   : Ember.K,
		onopen    : Ember.K,
		onclose   : Ember.K
	}
});
