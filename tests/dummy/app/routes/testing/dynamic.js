import Ember from 'ember';
import socketMixin from 'ember-websockets/mixins/sockets';

export default Ember.Route.extend(socketMixin, {
    socketURL: null,

    updateSocketURL: function(roomID) {
        this.set('socketURL', 'ws://localhost:8080/room/%@'.fmt(roomID));
    },

    model: function(params) {
        return {id: params.room_id};
    },

    setupController: function(controller, model) {
        this.updateSocketURL(model.id);
        this._super.apply(this, arguments);
    }
});
