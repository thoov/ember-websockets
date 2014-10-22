import Ember from 'ember';
import socketMixin from 'ember-sockets/mixins/sockets';

export default Ember.Route.extend(socketMixin, {

    socketURL: 'ws://localhost:8080',
    keepSocketAlive: false

});
