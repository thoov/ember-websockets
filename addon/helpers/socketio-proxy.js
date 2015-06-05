import Ember from 'ember';

export default Ember.ObjectProxy.extend({

  init() {
    this._super.apply(this, arguments);
  },

  /*
  * Adds a callback function into the listeners array which will
  * be invoked later whenever a given `type` event happens.
  *
  * type: must be either 'open', 'message', 'close', 'error'
  */
  on(type, callback, context) {
    this.socket.on(type, Ember.run.bind(context, callback));
  }
});
