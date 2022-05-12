import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class SimpleController extends Controller {
  @service('socket-io') socketService;

  constructor() {
    super(...arguments);

    let socketIO = this.socketService.socketFor('http://localhost:7100/');

    socketIO.on(
      'connect',
      function () {
        console.log('We have a connection'); // eslint-disable-line no-console
      },
      this
    );
  }
}
