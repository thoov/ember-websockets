import WebSocketService from './websockets';
import SocketIOProxy from '../helpers/socketio-proxy';

export default class SocketIOService extends WebSocketService {
  isWebSocketOpen(socket) {
    return socket.io.readyState !== 'closed';
  }

  createSocket(url, options = {}) {
    const newSocketIO = io(url, options);
    newSocketIO.connect();
    return newSocketIO;
  }

  createProxy(socket) {
    return SocketIOProxy.create({ content: this, socket })
  }
}
