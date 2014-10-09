import Ember from 'ember';


var READY_STATES = {
		NOT_ESTABLISHED: 0,
		ESTABLISHED: 1,
		CLOSING_HANDSHAKE: 2,
		CLOSED: 3
	};


export default Ember.Mixin.create({

	socketURL: null,
	socketConnection: null,

	setupController: function(controller) {

		var socketURL = this.get('socketURL'),
			websocket;


		/*
			Make sure that the socketURL is set

			TODO: a better check could be put here to check if the string
			is an actual url, etc.
		*/
		if( Ember.isEmpty(socketURL) ) {
			this._super.apply(this, arguments);
			return false;
		}


		/*
			Initialize the socket
		*/
		websocket = new window.WebSocket(this.get('socketURL'));
		websocket.onopen = function() {
			controller.send('onopen');
		};


		this.set('socketConnection', websocket);


		/*
			Make sure that we call the super function just in case the object
			who is using this mixin will have their activate function called.
		*/
		this._super.apply(this, arguments);
	},

	actions: {
		/*
			This is an action that controllers, components, view, etc can send
			which will make its way to the
		*/
		emit: function(data) {
			this.get('socketConnection').send(data);
		}
	}
});
