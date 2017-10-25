import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    onopen: function() {
      this.send('emit', 'hello world');
    }
  }
});
