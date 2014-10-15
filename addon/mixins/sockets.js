import Ember from 'ember';

export default Ember.Mixin.create({

	socketURL: null,
	socketConnection: null,

	setupController: function(controller) {

		var socketURL = this.get('socketURL'),
			socketEventListeners = ['onclose', 'onerror', 'onmessage', 'onopen'],
			websocket;


		/*
			Make sure that the socketURL is set

			TODO: a better check could be put here to check if the string
			is an actual url, etc.
		*/
		if(Ember.isEmpty(socketURL)) {
			this._super.apply(this, arguments);
			return false;
		}


		/*
			Initialize the socket
		*/
		websocket = new window.WebSocket(this.get('socketURL'));
		socketEventListeners.forEach(function(item) {
			websocket[item] = function(data) {
				this.send(item, data);
			}.bind(controller);
		});


		this.set('socketConnection', websocket);


		/*
			Make sure that we call the super function just in case the object
			who is using this mixin will have their activate function called.
		*/
		this._super.apply(this, arguments);
	},

	deactivate: function() {
		this.get('socketConnection').close();
	},

	actions: {
		/*
			This is an action that controllers, components, view, etc can send
			which will make its way to the
		*/
		emit: function(data) {
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
