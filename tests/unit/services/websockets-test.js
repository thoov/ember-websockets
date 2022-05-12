import { module, test } from 'qunit';
import { later } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

import { WebSocket as MockWebSocket, Server as MockServer } from 'mock-socket';

const { keys } = Object;

module('Unit | Service | Websocket', function (hooks) {
  setupTest(hooks);

  test('that calling socketFor will correctly create a connection', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');

    service.socketFor('ws://example.com:7000/');

    assert.strictEqual(keys(service.get('sockets')).length, 1);
    assert.strictEqual(keys(service.get('sockets'))[0], 'ws://examplecom:7000/');

    server.stop();
  });

  test('that calling socketFor will correctly cache a connection', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');
    const referenceA = service.socketFor('ws://example.com:7000/');
    const referenceB = service.socketFor('ws://example.com:7000/');

    assert.deepEqual(referenceA, referenceB);

    server.stop();
  });

  test('that calling socketFor with different urls opens seperate connections', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const serverA = new MockServer('ws://example.com:7000/');
    const serverB = new MockServer('ws://example.com:7001/');
    const referenceA = service.socketFor('ws://example.com:7000/');
    const referenceB = service.socketFor('ws://example.com:7001/');

    assert.strictEqual(keys(service.get('sockets')).length, 2);
    assert.notDeepEqual(referenceA, referenceB);

    serverA.stop();
    serverB.stop();
  });

  test('that on(open) works correctly', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');
    const socket = service.socketFor('ws://example.com:7000/');

    const mock = {
      openHandler() {
        assert.ok(true);

        server.stop();
        done();
      },
    };

    const done = assert.async();
    socket.on('open', mock.openHandler, mock);
  });

  test('that on(close) works correctly', function (assert) {
    const service = this.owner.lookup('service:websockets');
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
      },
    };

    const done = assert.async();

    socket.on('open', mock.openHandler, mock);
    socket.on('close', mock.closeHandler, mock);
  });

  test('that on(message) works correctly', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');
    const socket = service.socketFor('ws://example.com:7000/');

    const done = assert.async();
    const sampleMessage = 'SamepleData';

    server.on('connection', (server) => {
      server.send(sampleMessage);
    });

    const mock = {
      messageHandler(event) {
        assert.strictEqual(event.data, sampleMessage);

        server.stop();
        done();
      },
    };

    socket.on('message', mock.messageHandler, mock);
  });

  test('that on(error) works correctly', function (assert) {
    const service = this.owner.lookup('service:websockets');
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
      },
    };

    socket.on('open', mock.openHandler, mock);
    socket.on('error', mock.errorHandler, mock);
  });

  test('that off(close) works correctly', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');
    const socket = service.socketFor('ws://example.com:7000/');
    const done = assert.async();

    const mock = {
      openHandler() {
        assert.ok(true);

        socket.off('close', mock.closeHandler);
        socket.close();

        later(() => {
          server.stop();
          done();
        }, 100);
      },

      closeHandler() {
        assert.ok(false); // this should not be called
      },
    };

    socket.on('open', mock.openHandler, mock);
    socket.on('close', mock.closeHandler, mock);
  });

  test('that closeSocketFor works correctly', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');
    const socket = service.socketFor('ws://example.com:7000/');
    const done1 = assert.async();
    const done2 = assert.async();
    assert.expect(2);

    const mock = {
      openHandler() {
        service.closeSocketFor('ws://example.com:7000/');
        assert.strictEqual(Object.keys(service.get('sockets')).length, 0);

        done1();
      },

      closeHandler() {
        assert.ok(true);

        server.stop();
        done2();
      },
    };

    socket.on('open', mock.openHandler, mock);
    socket.on('close', mock.closeHandler, mock);
  });

  test('that you can reopen a socket after it closes', function (assert) {
    const service = this.owner.lookup('service:websockets');
    const server = new MockServer('ws://example.com:7000/');
    const socket = service.socketFor('ws://example.com:7000/');

    const done = assert.async();
    let counter = 0;

    socket.on(
      'open',
      () => {
        assert.ok(true);
        socket.close();
      },
      this
    );

    socket.on(
      'close',
      () => {
        assert.ok(true);
        if (counter === 0) {
          socket.reconnect();
        } else {
          server.stop();
          done();
        }
        counter++;
      },
      this
    );
  });
});
