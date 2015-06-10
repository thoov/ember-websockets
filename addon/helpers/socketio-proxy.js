import Ember from 'ember';

export default Ember.ObjectProxy.extend({
  /*
  * socket.on('connect', this.onConnection, this);
  */
  on(type, callbackFn, context) {
    this.socket.on(type, Ember.run.bind(context, callbackFn));
  },

  /*
  * socket.emit('connect', {foo: 'bar'});
  * socket.emit('connect', {foo: 'bar'}, function() {}, this);
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
