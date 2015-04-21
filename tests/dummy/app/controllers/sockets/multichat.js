import Ember from 'ember';

export default Ember.Controller.extend({
  messageText: null,
  messages: null,

  init() {
    this._super(...arguments);
    this.messages = Ember.A();
  },

  actions: {
    onopen: function() {},

    onmessage: function(messageFromSocket) {
      this.get('messages').pushObject({text: messageFromSocket.data});
    },

    submitText: function(serverName) {
      if(serverName) {
        this.send('emit', this.get('messageText'), serverName, true);
      }
      else {
        this.send('emit', this.get('messageText'), true);
      }

      this.set('messageText', null);
    }
  }
});
