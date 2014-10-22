import Ember from 'ember';
import socketsMixin from 'ember-sockets/mixins/sockets';

export default Ember.Route.extend(socketsMixin, {

    socketURL: 'ws://localhost:8080'

});
