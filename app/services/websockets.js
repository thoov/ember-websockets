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
  * }
  */
  sockets: [],

  /*
  * socketFor returns a websocket proxy object. On this object there is a property `socket`
  * which contains the actual websocket object. This websocket object is cached based off of the url meaning
  * multiple requests for the same socket will return the same object.
  */
  socketFor(URL) {
    var proxy = this.get('sockets').findBy('url', this.normalizeURL(URL));
    if (proxy) { return proxy.socket; }

    proxy = WebsocketProxy.create({
      content: this,
      socket: new WebSocket(this.normalizeURL(URL))
    });

    this.get('sockets').pushObject({
      url: proxy.socket.url,
      socket: proxy
    });

    return proxy;
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(URL) {
    var filteredSockets = [];

    forEach(this.get('sockets'), item => {
      if(item.url === this.normalizeURL(URL)) {
        item.socket.close();
      }
      else {
        filteredSockets.push(item);
      }
    });

    this.set('sockets', filteredSockets);
  },

  normalizeURL(URL) {
    return URL; //TODO: fix this
  }
});
