import Ember from 'ember';

export default Ember.Controller.extend({

    actions: {
        onopen: function(e) {
            Ember.Logger.log('On open called: ' + e.target.url);
        },
        onclose: function(e) {
            Ember.Logger.log('On close called: ' + e.target.url);
        }
    }
});
