import Ember from 'ember';

export default Ember.ObjectController.extend({


	actions: {
		onopen: function() {
			this.send('emit', 'hello world');
		}
	}


});
