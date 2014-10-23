import Ember from 'ember';
import socketMixin from 'ember-websockets/mixins/sockets';

export default Ember.Route.extend(socketMixin, {

    socketURL: 'ws://localhost:8080/foo/bar',
    keepSocketAlive: false

});
