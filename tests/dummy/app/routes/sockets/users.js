import Ember from 'ember';
import socketsMixin from 'ember-websockets/mixins/sockets';

export default Ember.Route.extend(socketsMixin, {

    socketURL: 'ws://localhost:8080'

});
