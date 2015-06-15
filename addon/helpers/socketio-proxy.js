import Ember from 'ember';

export default Ember.ObjectProxy.extend({
  /*
  * This method simply passes the arguments to the socketio on method except it binds the callback function to
  * the run loop.
  */
  on(type, callbackFn, context) {
    this.socket.on(type, Ember.run.bind(context, callbackFn));
  },

  /*
  * This method passes the argument to the socketio emit method. If an acknowledgement function is passed then
  * we bind that in a run loop.
  */
  emit(channel, data, acknowledgementFn, context) {
    if(acknowledgementFn && context) {
      this.socket.emit.call(this.socket, channel, data, Ember.run.bind(context, acknowledgementFn));
    }
    else {
      this.socket.emit.apply(this.socket, arguments);
    }
  },

  send() {
    this.socket.send.apply(this.socket, arguments);
  },

  close() {
    this.socket.close.apply(this.socket, arguments);
  },

  connect() {
    this.socket.connect.apply(this.socket, arguments);
  }
});
