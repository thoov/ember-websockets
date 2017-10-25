import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  messageText: null,
  messages: null,

  socketService: service('websockets'),

  init() {
    this._super(...arguments);
    this.messages = A();

    var socket = this.get('socketService').socketFor('ws://localhost:8080/foo/bar');

    socket.on('open', () => {
      console.log('On open called'); // eslint-disable-line no-console
    }, this);

    socket.on('close', () => {
      console.log('On close called'); // eslint-disable-line no-console
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
