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
    const normalizedUrl = normalizeURL(url);
    const cleanedUrl = normalizedUrl.replace(/\./g, '');
    const existingProxy = this.get(`sockets.${cleanedUrl}`);

    if (existingProxy && isWebSocketOpen(existingProxy.socket)) {
      return existingProxy.socket;
    }

    const newProxy = SocketIOProxy.create({ content: this, socket: io(normalizedUrl, options) });

    newProxy.socket.connect();

    this.set(`sockets.${cleanedUrl}`, { url: normalizedUrl, socket: newProxy });

    return newProxy;
  },

  /*
  * closeSocketFor closes the socket for a given url.
  */
  closeSocketFor(url) {
    const normalizedUrl = normalizeURL(url);
    const cleanedUrl = normalizedUrl.replace(/\./g, '');
    const sockets = this.get('sockets');
    const socket = sockets[cleanedUrl];
    socket.socket.close();
    socket.socket.removeAllListeners();
    delete sockets[cleanedUrl];

    this.set('sockets', sockets);
  }
});
