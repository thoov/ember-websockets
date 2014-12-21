import Ember from 'ember';

export default Ember.Controller.extend({
	onopen: Ember.K,
	onmessage: Ember.K,
	onclose: Ember.K,
	onerror: Ember.K,

	actions: {
		onopen: function() {
			this.onopen.apply(this, arguments);
		},
		onmessage: function() {
			this.onmessage.apply(this, arguments);
		},
		onclose: function() {
			this.onclose.apply(this, arguments);
		},
		onerror: function() {
			this.onerror.apply(this, arguments);
		}
	}
});
