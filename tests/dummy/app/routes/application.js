import Ember from 'ember';
import Sockets from 'ember-sockets/mixins/sockets';

export default Ember.Route.extend(Sockets, {
	socketURL: 'ws://localhost:8080'
});
