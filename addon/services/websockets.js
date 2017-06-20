import Ember from 'ember';
import WebsocketProxy from '../helpers/websocket-proxy';
import { normalizeURL, cleanURL } from '../helpers';

const { Service, get, set } = Ember;

export default Service.extend({
  /*
    A hash of open websocket connections. This
    allows multiple components to share the same connection.

    {
      'websocket-url': WebSocket Proxy object
    }
  */
  sockets: Ember.computed(function() {
    return {};
  }),

  /*
    socketFor returns a websocket proxy object. On this object there is a property `socket`
    which contains the actual websocket object. This websocket object is cached based off of the url meaning
    multiple requests for the same socket will return the same object.
  */
  socketFor(url, protocols = []) {
    /*
      Websockets allows either a string or array of strings to be passed as the second argument.
      Normalize both cases into an array of strings so we can just deal with arrays.
    */
    if (typeof protocols === 'string') { protocols = [protocols]; }

    /*
      Normalize the url as native websockets add a / to the end of the url:
      http://example.com:8000 becomes: http://example.com:8000/

      Since the url will be used as a key will need to make sure that it does not
      contain '.' as it will throw ember off
    */
    const normalizedUrl = normalizeURL(url);
    const cleanedUrl = cleanURL(normalizedUrl);

    /*

    */
    const existingProxy = get(this, `sockets.${cleanedUrl}`);

    if (existingProxy && this.isWebSocketOpen(existingProxy.socket)) {
      return existingProxy;
    }

    /*
      we can get to this place if the websocket has been closed and we are trying to reopen
      or we are creating a proxy for the first time
    */
    const newWebSocket = this.createSocket(normalizedUrl, protocols);

    if (existingProxy) {
      /*
        If there is an existing socket in place we simply update the websocket object and not
        the whole proxy as we dont want to destroy the previous listeners.
      */
      set(existingProxy, 'socket', newWebSocket);
      return existingProxy;
    }

    const newProxy = this.createProxy(newWebSocket, protocols);

    set(this, `sockets.${cleanedUrl}`, newProxy);

    return newProxy;
  },

  closeSocketFor(url) {
    const cleanedUrl = cleanURL(normalizeURL(url));
    const existingSocket = get(this, `sockets.${cleanedUrl}`);
    if (existingSocket)
    {
      existingSocket.socket.close();
    }
    delete get(this, 'sockets')[cleanedUrl];
  },

  isWebSocketOpen(websocket) {
    return websocket.readyState !== WebSocket.CLOSED;
  },

  createSocket(url, options) {
    return new WebSocket(url, options);
  },

  createProxy(socket, protocols) {
    return WebsocketProxy.create({ content: this, protocols, socket });
  }
});
