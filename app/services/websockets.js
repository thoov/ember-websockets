import Ember from 'ember';
import WebsocketProxy from 'ember-websockets/helpers/websocket-proxy';

const forEach = Array.prototype.forEach;
const filter  = Array.prototype.filter;
const isArray = Ember.isArray;

export default Ember.Service.extend({
  /*
  * Each element in the array is of the form:
  *
  * {
  *    url: 'string'
  *    socket: WebSocket Proxy object
  * }
  */
  sockets: null,

  init() {
    this._super(...arguments);
    this.sockets = Ember.A();
  },

  /*
  * socketFor returns a websocket proxy object. On this object there is a property `socket`
  * which contains the actual websocket object. This websocket object is cached based off of the url meaning
  * multiple requests for the same socket will return the same object.
  */
  socketFor(url, protocols = []) {
    var proxy = this.findSocketInCache(this.get('sockets'), url);

    if (proxy && this.websocketIsNotClosed(proxy.socket)) { return proxy.socket; }

    // Websockets allows either a string or array of strings to be passed as the second argument.
    // This normalizes both cases into one where they are all arrays of strings and if you just pass
    // a single string it becomes an array of one.
    if(!isArray(protocols)) { protocols = [protocols]; }

    proxy = WebsocketProxy.create({
      content: this,
      protocols: protocols,
      socket: new WebSocket(this.normalizeURL(url), protocols)
    });

    // If there is an existing socket in place we simply update the websocket object and not
    // the whole proxy as we dont want to destroy the previous listeners.
    var existingSocket = this.findSocketInCache(this.get('sockets'), url);
    if(existingSocket) {
      existingSocket.socket.socket = proxy.socket;
      return existingSocket.socket;
    }
    else {
      this.get('sockets').pushObject({
        url: proxy.socket.url,
        socket: proxy
      });
    }

    return proxy;
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(url) {
    var filteredSockets = [];

    forEach.call(this.get('sockets'), item => {
      if(item.url === this.normalizeURL(url)) {
        item.socket.close();
      }
      else {
        filteredSockets.push(item);
      }
    });

    this.set('sockets', Ember.A(filteredSockets));
  },

  /*
  * The native websocket object will transform urls without a pathname to have just a /.
  * As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
  * change. This function does this transformation to stay inline with the native websocket implementation.
  */
  normalizeURL(url) {
    var parsedUrl = new URI(url);

    if(parsedUrl.path() === '/' && url.slice(-1) !== '/') {
      return url + '/';
    }

    return url;
  },

  websocketIsNotClosed(websocket) {
    return websocket.socket.readyState !== window.WebSocket.CLOSED;
  },

  /*
  * Returns the socket object from the cache if one matches the url else undefined
  */
  findSocketInCache(socketsCache, url) {
    var cachedResults = filter.call(socketsCache, websocket => {
      return websocket['url'] === this.normalizeURL(url);
    });

    if(cachedResults.length > 0) {
      return cachedResults[0];
    }
  }
});
