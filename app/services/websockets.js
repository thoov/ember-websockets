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
  sockets: null,

  init() {
    this._super(...arguments);
    this.sockets = Ember.makeArray();
  },

  /*
  * socketFor returns a websocket proxy object. On this object there is a property `socket`
  * which contains the actual websocket object. This websocket object is cached based off of the url meaning
  * multiple requests for the same socket will return the same object.
  */
  socketFor(URL) {
    var proxy = this.get('sockets').findBy('url', this.normalizeURL(URL));
    if (proxy && this.websocketIsNotClosed(proxy.socket)) { return proxy.socket; }

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

  /*
  * The native websocket object will transform urls without a pathname to have just a /.
  * As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
  * change. This function does this transformation to stay inline with the native websocket implementation.
  *
  */
  normalizeURL(URL) {
    var url = new URI(URL);

    if(url.path() === '/' && URL.slice(-1) !== '/') {
      return URL + '/';
    }

    return URL;
  },

  websocketIsNotClosed(websocket) {
    return websocket.socket.readyState !== window.WebSocket.CLOSED;
  }
});
