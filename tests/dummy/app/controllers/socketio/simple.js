import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('socket-io'),

  init: function() {
    this._super.apply(this, arguments);

    var socketIO = this.get('socketService').socketFor('http://localhost:7100/');

    socketIO.on('connect', function() {
      console.log('We have a connection');
    }, this);
  }
});
