import Ember from 'ember';
import PrimusProxy from 'ember-websockets/helpers/primus-proxy';
import NormalizeUrlMixin from 'ember-websockets/mixins/normalize-url';

const { filter, forEach } = Array.prototype;
const isArray = Ember.isArray;

export default Ember.Service.extend(NormalizeUrlMixin, {
  /*
  * Each element in the array is of the form:
  *
  * {
  *    url: 'string'
  *    socket: Primus Proxy object
  * }
  */
  sockets: null,

  init() {
    this._super(...arguments);
    this.sockets = Ember.A();
  },

  /*
  * socketFor returns a primus client proxy object. On this object there is a property `socket`
  * which contains the actual primus client object. This primus client object is cached based off of the url meaning
  * multiple requests for the same socket will return the same object.
  */
  socketFor(url, protocols = []) {
    var proxy = this.findSocketInCache(this.get('sockets'), url);

    if (proxy && this.primusIsNotClosed(proxy.socket)) { return proxy.socket; }

    if(!isArray(protocols)) { protocols = [protocols]; }

    proxy = PrimusProxy.create({
      content: this,
      protocols: protocols,
      socket: Primus.connect(url, {
        reconnect: {
          max: Infinity,
          min: 500,
          retries: 10
        }
      })
    });

    // If there is an existing socket in place we simply update the primus client object and not
    // the whole proxy as we dont want to destroy the previous listeners.
    var existingSocket = this.findSocketInCache(this.get('sockets'), url);
    if(existingSocket) {
      existingSocket.socket.socket = proxy.socket;
      return existingSocket.socket;
    }
    else {
      this.get('sockets').pushObject({
        'url': url,
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

  primusIsNotClosed(websocket) {
    return true
    //return websocket.socket.readyState !== window.WebSocket.CLOSED;
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
