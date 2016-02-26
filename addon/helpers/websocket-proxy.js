import Ember from 'ember';

const events  = ['close', 'error', 'message', 'open'];
const { filter, indexOf, forEach } = Array.prototype;
const { assert } = Ember;

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

  protocols: null,

  init() {
    this._super(...arguments);
    this.listeners = [];
    this.setupInternalListeners();
  },

  /*
  * Adds a callback function into the listeners array which will
  * be invoked later whenever a given `type` event happens.
  *
  * type: must be either 'open', 'message', 'close', 'error'
  */
  on(type, callback, context) {
    assert(`${type} is not a recognized event name. Please use on of the following: ${events.join(', ')}`, indexOf.call(events, type) !== -1);
    assert('The second argument must be a function.', typeof callback === 'function');

    this.listeners.push({ url: this.socket.url, type, callback, context });
  },

  /*
  * Removes a callback function from the listeners array. This callback
  * will not longer be invoked when the given `type` event happens.
  */
  off(type, callback) {
    this.listeners = filter.call(this.listeners, listeners => !(listeners.callback === callback && listeners.type === type));
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

    assert('Cannot send message to the websocket while it is not open.', this.readyState() === WebSocket.OPEN);

    this.socket.send(message);
  },

  close() {
    this.socket.close();
  },

  reconnect() {
    this.set('socket', new WebSocket(this.socket.url, this.get('protocols')));
    this.setupInternalListeners();
  },

  setupInternalListeners() {
    forEach.call(events, eventName => {
      this.socket[`on${eventName}`] = event => {
        Ember.run(() => {
          var activeListeners = filter.call(this.listeners, listener => {
            return listener.url === event.currentTarget.url && listener.type === eventName;
          });

          // TODO: filter active listeners for contexts that are not destroyed
          forEach.call(activeListeners, item => {
            if (item.context) {
              item.callback.call(item.context, event);
            }
            else {
              item.callback(event);
            }
          });
        });
      };
    });
  },

  /*
  * A helper method to get access to the readyState of the websocket.
  */
  readyState() { return this.socket.readyState; }
});
