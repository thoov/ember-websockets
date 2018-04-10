import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  socketService: service('socket-io'),

  init() {
    this._super(...arguments);

    var socketIO = this.get('socketService').socketFor('http://localhost:7100/');

    socketIO.on('connect', function() {
      console.log('We have a connection'); // eslint-disable-line no-console
    }, this);
  }
});
