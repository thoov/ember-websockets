import Ember from 'ember';

export default Ember.Controller.extend({
  messageText: null,
  messages: null,

  socketService: Ember.inject.service('websockets'),

  init() {
    this._super(...arguments);
    this.messages = Ember.A();

    var socket = this.get('socketService').socketFor('ws://localhost:8080/foo/bar');

    socket.on('open', () => {
      console.log('On open called');
    }, this);

    socket.on('close', () => {
      console.log('On close called');
    }, this);

    socket.on('message', (messageFromSocket) => {
      this.get('messages').pushObject({text: messageFromSocket.data});
    }, this);
  },

  actions: {
    submitText: function() {
      var socket = this.get('socketService').socketFor('ws://localhost:8080/foo/bar');
      socket.send(this.get('messageText'), true);
    }
  }
});
