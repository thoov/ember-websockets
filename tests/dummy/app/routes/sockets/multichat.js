import Ember from 'ember';
import socketMixin from 'ember-websockets/mixins/sockets';

export default Ember.Route.extend(socketMixin, {
  socketConfigurations: [{
    key: 'socket1',
    socketURL: 'ws://localhost:8101/',
    keepSocketAlive: false
  },{
    key: 'socket2',
    socketURL: 'ws://localhost:8102',
    keepSocketAlive: false
  }]
});
