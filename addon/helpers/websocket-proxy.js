import Ember from 'ember';

var events  = ['close', 'error', 'message', 'open'];
var filter  = Ember.EnumerableUtils.filter;
var indexOf = Ember.EnumerableUtils.indexOf;
var forEach = Ember.EnumerableUtils.forEach;

export default Ember.ObjectProxy.extend({
  /*
  * {
  *    url: 'String'
  *    type: 'String' (such as 'open', 'message', 'close', and 'error')
  *    callback: The function to envoke
  *    context: The context of the function
  * }
  */
  listeners: null,

  init() {
    this._super.apply(this, arguments);
    this.listeners = Ember.makeArray();
    this.setupInternalListeners();
  },

  /*
  * Adds a callback function into the listeners array which will
  * be invoked later whenever a given `type` event happens.
  *
  * type: must be either 'open', 'message', 'close', 'error'
  */
  on(type, callback, context) {
    Ember.assert(type + ' is not a recognized event name. Please use on of the following: ' + events.join(', '), indexOf(events, type) !== -1);
    Ember.assert('The second argument must be a function.', Ember.typeOf(callback) === 'function');
    Ember.assert('The third argument must be the context of the surrounding object.', Ember.typeOf(context) !== 'undefined');

    this.listeners.push({
      url: this.socket.url,
      type: type,
      callback: callback,
      context: context
    });
  },

  /*
  * Removes a callback function from the listeners array. This callback
  * will not longer be invoked when the given `type` event happens.
  */
  off(type, callback) {
    this.listeners = filter(this.listeners, listeners => {
      return !(listeners.callback === callback && listeners.type === type);
    });
  },

  /*
  * Message is the message which will be passed into the native websockets send method
  * and shouldStringify is a boolean which determines if we should call JSON.stringify on
  * the message.
  */
  send(message, shouldStringify = false) {
    if(shouldStringify && JSON && JSON.stringify) {
      message = JSON.stringify(message);
    }

    this.socket.send(message);
  },

  close() {
    this.socket.close();
  },

  reconnect() {
    this.set('socket', new WebSocket(this.socket.url));
    this.setupInternalListeners();
  },

  setupInternalListeners() {
    var self = this;

    forEach(events, eventName => {
      this.socket['on' + eventName] = event => {
        Ember.run(() => {
          var activeListeners = filter(self.listeners, listener => {
            return listener.url === event.currentTarget.url && listener.type === eventName;
          });

          // TODO: filter active listeners for contexts that are not destroyed

          activeListeners.forEach(item => {
            item.callback.call(item.context, event);
          });
        });
      };
    });
  }
});
