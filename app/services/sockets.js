import Ember from 'ember';
import WebsocketProxy from 'ember-websockets/helpers/websocket-proxy';

var forEach = Ember.EnumerableUtils.forEach;

export default Ember.Service.extend({

  /*
  * Each element in the array is of form:
  *
  * {
  *    url: 'string'
  *    socket: WebSocket Proxy object
  *  }
  */
  sockets: [],

  socketFor(URL) {
    var proxy = this.get('sockets').findBy('url', URL); // TODO: need to normalize the url
    if (proxy) { return proxy.socket; }

    proxy = WebsocketProxy.create({
      content: this,
      socket: new WebSocket(URL)
    });

    this.get('sockets').pushObject({
      url: proxy.socket.url,
      socket: proxy
    });

    return proxy;
  },

  closeSocketFor(URL) {
    var filteredSockets = [];

    forEach(this.get('sockets'), item => {
      if(item.url === URL) { // TODO: need to noramlize this url
        item.socket.close();
      }
      else {
        filteredSockets.push(item);
      }
    });

    this.set('sockets', filteredSockets);
  }
});
