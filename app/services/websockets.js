import Ember from 'ember';
import { normalizeURL } from 'ember-websockets/helpers';
import WebsocketProxy from 'ember-websockets/helpers/websocket-proxy';

const { Service, isArray, A } = Ember;
const { forEach, filter } = Array.prototype;

function isWebSocketOpen(websocket) {
  return websocket.socket.readyState !== window.WebSocket.CLOSED;
}

export default Service.extend({

  /*
  * A hash of open websocket connections. This
  * allows multiple components to share the same connection.
  *
  * {
  *    'websocket-url': WebSocket Proxy object
  * }
  */
  sockets: {},

  /*
  * socketFor returns a websocket proxy object. On this object there is a property `socket`
  * which contains the actual websocket object. This websocket object is cached based off of the url meaning
  * multiple requests for the same socket will return the same object.
  */
  socketFor(url, protocols = []) {
    // Websockets allows either a string or array of strings to be passed as the second argument.
    // Normalize both cases into an array of strings so we can just deal with arrays.
    if(!isArray(protocols)) { protocols = [protocols]; }

    let existingProxy = this.get(`sockets.${normalizeURL(url)}`);

    if (existingProxy && isWebSocketOpen(existingProxy.socket)) {
      return existingProxy.socket;
    }

    // we can get to this place if the websocket has been closed and we are trying to reopen
    // or we are creating a proxy for the first time
    const newWebSocket = new WebSocket(normalizeURL(url), protocols);

    if (existingProxy) {
      // If there is an existing socket in place we simply update the websocket object and not
      // the whole proxy as we dont want to destroy the previous listeners.

      existingSocket.socket.socket = newWebSocket;
      return newWebSocket;
    }

    const newProxy = WebsocketProxy.create({ content: this, protocols, socket: new WebSocket(normalizeURL(url), protocols) });

    this.set(`sockets.${normalizeURL(url)}`, { url: newProxy.socket.url, socket: newProxy });

    return newProxy;
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(url) {
    const sockets = this.get('sockets');
    const socket = sockets[normalizeURL(url)];
    socket.socket.close();
    delete sockets[normalizeURL(url)];

    this.set('sockets', sockets);
  }
});
