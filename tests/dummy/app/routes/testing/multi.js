import Ember from 'ember';
import socketMixin from 'ember-websockets/mixins/sockets';

export default Ember.Route.extend(socketMixin, {

    socketConfigurations: [{
        url: 'ws://localhost:8081',
        keepSocketAlive: false
    },{
        url: 'ws://localhost:8082',
        keepSocketAlive: false
    }]
});
