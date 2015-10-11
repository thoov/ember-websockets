import Ember from 'ember';
import SocketIOProxy from 'ember-websockets/helpers/socketio-proxy';

var filter = Array.prototype.filter;
var forEach = Array.prototype.forEach;

export default Ember.Service.extend({
  /*
  * Each element in the array is of the form:
  *
  * {
  *    url: 'string'
  *    socket: SocketIO Proxy object
  * }
  */
  sockets: null,

  init() {
    this._super(...arguments);
    this.sockets = Ember.A();
  },

  /*
  * socketFor returns a socketio proxy object. On this object there is a property `socket`
  * which contains the actual socketio object. This socketio object is cached based off of the
  * url meaning multiple requests for the same socket will return the same object.
  */
  socketFor(url, options = {}) {
    var proxy = this.findSocketInCache(this.get('sockets'), url);

    if (proxy && this.socketIsNotClosed(proxy.socket)) { return proxy.socket; }

    proxy = SocketIOProxy.create({
      content: this,
      socket: io(this.normalizeURL(url), options)
    });

    proxy.socket.connect();

    this.get('sockets').pushObject({
      url: this.normalizeURL(url),
      socket: proxy
    });

    return proxy;
  },

  /*
  * The native websocket object will transform urls without a pathname to have just a /.
  * As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
  * change. This function does this transformation to stay inline with the native websocket implementation.
  *
  */
  normalizeURL(url) {
    var parsedUrl = new URI(url);

    if(parsedUrl.path() === '/' && url.slice(-1) !== '/') {
      return url + '/';
    }

    return url;
  },

  socketIsNotClosed(socket) {
    return socket.socket.io.readyState !== 'closed';
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(url) {
    var filteredSockets = [];

    forEach.call(this.get('sockets'), item => {
      if(item.url === this.normalizeURL(url)) {
        item.socket.close();
        item.socket.socket.removeAllListeners();
      }
      else {
        filteredSockets.push(item);
      }
    });

    this.set('sockets', Ember.A(filteredSockets));
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
