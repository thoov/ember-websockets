import Ember from 'ember';
import SocketIOProxy from 'ember-websockets/helpers/socketio-proxy';
import { normalizeURL } from 'ember-websockets/helpers';

const { Service } = Ember;

function isWebSocketOpen(socket) {
  return socket.socket.io.readyState !== 'closed';
}

export default Service.extend({

  /*
  * Each element in the array is of the form:
  *
  * {
  *    url: 'string'
  *    socket: SocketIO Proxy object
  * }
  */
  sockets: {},

  /*
  * socketFor returns a socketio proxy object. On this object there is a property `socket`
  * which contains the actual socketio object. This socketio object is cached based off of the
  * url meaning multiple requests for the same socket will return the same object.
  */
  socketFor(url, options = {}) {
    const existingProxy = this.get(`sockets.${normalizeURL(url)}`);

    if (existingProxy && isWebSocketOpen(existingProxy.socket)) {
      return existingProxy.socket;
    }

    const newProxy = SocketIOProxy.create({ content: this, socket: io(normalizeURL(url), options) });

    newProxy.socket.connect();

    this.set(`sockets.${normalizeURL(url)}`, { url: normalizeURL(url), socket: newProxy });

    return newProxy;
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(url) {
    const sockets = this.get('sockets');
    const socket = sockets[normalizeURL(url)];
    socket.socket.close();
    socket.socket.removeAllListeners();
    delete sockets[normalizeURL(url)];

    this.set('sockets', sockets);
  }
});
