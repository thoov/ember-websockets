import Ember from 'ember';
import socketMixin from 'ember-websockets/mixins/sockets';

export default Ember.Route.extend(socketMixin, {
  socketURL: null,

  updateSocketURL: function(roomID) {
    this.set('socketURL', Ember.String.fmt('ws://localhost:8084/room/%@', roomID));
  },

  model: function(params) {
    return {id: params.room_id};
  },

  setupController: function(controller, model) {
    this.updateSocketURL(model.id);
    this._super.apply(this, arguments);
  }
});
