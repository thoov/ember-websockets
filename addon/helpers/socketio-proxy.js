import Ember from 'ember';

const { bind } = Ember.run;
const { assert, ObjectProxy } = Ember;

export default ObjectProxy.extend({

  /*
  * {
  *    url: 'String'
  *    type: 'String'
  *    callback: The function to envoke
  *    context: The context of the function
  *    ref: The actual callback function with is given to socketio
  * }
  */
  listeners: null,

  init() {
    this._super(...arguments);
    this.listeners = [];
  },

  /*
  * This method simply passes the arguments to the socketio on method except it binds the callback function to
  * the run loop.
  */
  on(type, callback, context) {
    assert('The second argument must be a function.', typeof(callback) === 'function');

    const bindedCallback = bind(context, callback);
    this.listeners.push({url: this.socket.io.uri, type, callback, context, ref: bindedCallback});
    this.socket.on(type, bindedCallback);
  },

  off(type, callback) {
    assert('The second argument must be a function.', typeof(callback) === 'function');
    const listeners = this.listeners.filter(listener => listener.callback === callback && listener.url === this.socket.io.uri && listener.type === type);

    if (listeners) {
      listeners.forEach(item => this.socket.off(type, item.ref));
    }

    this.listeners = this.listeners.filter(l => listeners.indexOf(l) === -1);
  },

  /*
  * This method passes the argument to the socketio emit method. If an acknowledgement function is passed then
  * we bind that in a run loop.
  */
  emit(channel, data, acknowledgementFn, context) {
    if(acknowledgementFn && context) {
      this.socket.emit.call(this.socket, channel, data, bind(context, acknowledgementFn));
    }
    else {
      this.socket.emit.apply(this.socket, arguments);
    }
  },

  close() {
    this.listeners = this.listeners.filter(listener => listener.url === this.socket.io.uri);
    this.socket.close.apply(this.socket, arguments);
  },

  send() { this.socket.send.apply(this.socket, arguments); },
  connect() { this.socket.connect.apply(this.socket, arguments); }
});
