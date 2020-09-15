import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ExampleController extends Controller {
  messageText = null;
  messages = A();

  @service('websockets') socketService;

  constructor() {
    super(...arguments);

    let socket = this.socketService.socketFor('ws://localhost:8080/foo/bar');

    socket.on('open', () => {
      console.log('On open called'); // eslint-disable-line no-console
    }, this);

    socket.on('close', () => {
      console.log('On close called'); // eslint-disable-line no-console
    }, this);

    socket.on('message', (messageFromSocket) => {
      this.messages.pushObject({text: messageFromSocket.data});
    }, this);
  }

  @action
  submitText() {
    let socket = this.socketService.socketFor('ws://localhost:8080/foo/bar');
    socket.send(this.messageText, true);
  }
}
