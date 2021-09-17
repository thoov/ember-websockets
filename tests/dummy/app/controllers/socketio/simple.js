import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { SocketIO } from 'mock-socket';
import ENV from 'dummy/config/environment';


export default class SimpleController extends Controller {
  @service('socket-io') socketService;

  messageText = null;
  messages = A();
  socketIO = null;

  constructor() {
    super(...arguments);

    if (ENV.environment === 'test') {
      this.socketIO = new SocketIO('ws://localhost:7100');
    } else {
      this.socketIO = this.socketService.socketFor('ws://localhost:7100/');
    }

    this.socketIO.on('connect', function() {
      console.log('We have a connection'); // eslint-disable-line no-console
    }, this);

    this.socketIO.on('message', (messageFromSocket) => {
      this.messages.pushObject({text: messageFromSocket});
    }, this);
  }

  @action
  submitText() {
    this.socketIO.emit('message', JSON.stringify(this.messageText));
  }
}
