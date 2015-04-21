import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onopen: function() {
      this.send('emit', 'hello world');
    }
  }
});
