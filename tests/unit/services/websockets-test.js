import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

import {
  WebSocket as MockWebSocket,
  Server as MockServer
} from 'mock-socket';

const { keys } = Object;

moduleFor('service:websockets', 'Unit | Service | Websocket', { unit: true });

test('that calling socketFor will correctly create a connection', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');

  service.socketFor('ws://example.com:7000/');

  assert.expect(2);
  assert.equal(keys(service.get('sockets')).length, 1);
  assert.equal(keys(service.get('sockets'))[0], 'ws://examplecom:7000/');

  server.stop();
});

test('that calling socketFor will correctly cache a connection', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const referenceA = service.socketFor('ws://example.com:7000/');
  const referenceB = service.socketFor('ws://example.com:7000/');

  assert.expect(1);
  assert.deepEqual(referenceA, referenceB);

  server.stop();
});

test('that calling socketFor with different urls opens seperate connections', function(assert) {
  const service = this.subject({ sockets: {} });
  const serverA = new MockServer('ws://example.com:7000/');
  const serverB = new MockServer('ws://example.com:7001/');
  const referenceA = service.socketFor('ws://example.com:7000/');
  const referenceB = service.socketFor('ws://example.com:7001/');

  assert.expect(2);
  assert.equal(keys(service.get('sockets')).length, 2);
  assert.notDeepEqual(referenceA, referenceB);

  serverA.stop();
  serverB.stop();
});

test('that on(open) works correctly', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const socket = service.socketFor('ws://example.com:7000/');

  const mock = {
    openHandler() {
      assert.ok(true);

      server.stop();
      done();
    }
  };

  const done = assert.async();
  assert.expect(1);

  socket.on('open', mock.openHandler, mock);
});

test('that on(close) works correctly', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const socket = service.socketFor('ws://example.com:7000/');

  const mock = {
    openHandler() {
      service.closeSocketFor('ws://example.com:7000/');
    },

    closeHandler() {
      assert.ok(true);

      server.stop();
      done();
    }
  };

  const done = assert.async();
  assert.expect(1);

  socket.on('open', mock.openHandler, mock);
  socket.on('close', mock.closeHandler, mock);
});

test('that on(message) works correctly', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const socket = service.socketFor('ws://example.com:7000/');

  const done = assert.async();
  const sampleMessage = 'SamepleData';

  assert.expect(1);

  server.on('connection', (server) => {
    server.send(sampleMessage);
  });

  const mock = {
    messageHandler(event) {
      assert.equal(event.data, sampleMessage);

      server.stop();
      done();
    }
  };

  socket.on('message', mock.messageHandler, mock);
});

test('that on(error) works correctly', function(assert) {
  const service = this.subject({ sockets: {} });

  const originalWebSocket = window.WebSocket;
  window.WebSocket = MockWebSocket;

  const socket = service.socketFor('ws://example.com:7000');
  const done = assert.async();

  const mock = {
    openHandler() {
      assert.ok(false);
      window.WebSocket = originalWebSocket;
    },

    errorHandler() {
      assert.ok(true);

      window.WebSocket = originalWebSocket;
      done();
    }
  };

  assert.expect(1);
  socket.on('open', mock.openHandler, mock);
  socket.on('error', mock.errorHandler, mock);
});

test('that off(close) works correctly', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const socket = service.socketFor('ws://example.com:7000/');
  const done = assert.async();

  const mock = {
    openHandler() {
      assert.ok(true);

      socket.off('close', mock.closeHandler);
      socket.close();

      Ember.run.later(() => {
        server.stop();
        done();
      }, 100);
    },

    closeHandler() {
      assert.ok(false); // this should not be called
    }
  };

  assert.expect(1);

  socket.on('open', mock.openHandler, mock);
  socket.on('close', mock.closeHandler, mock);
});

test('that closeSocketFor works correctly', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const socket = service.socketFor('ws://example.com:7000/');
  const done = assert.async();
  assert.expect(1);

  const mock = {
    openHandler() {
      service.closeSocketFor('ws://example.com:7000/');
    },

    closeHandler() {
      assert.ok(true);

      server.stop();
      done();
    }
  };

  socket.on('open', mock.openHandler, mock);
  socket.on('close', mock.closeHandler, mock);
});

test('that you can reopen a socket after it closes', function(assert) {
  const service = this.subject({ sockets: {} });
  const server = new MockServer('ws://example.com:7000/');
  const socket = service.socketFor('ws://example.com:7000/');

  const done = assert.async();
  let counter = 0;

  assert.expect(4);

  socket.on('open', () => {
    assert.ok(true);
    socket.close();
  }, this);

  socket.on('close', () => {
    assert.ok(true);
    if (counter === 0) {
      socket.reconnect();
    } else {
      server.stop();
      done();
    }
    counter++;
  }, this);
});
