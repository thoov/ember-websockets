import { module, test } from 'qunit';
import { visit, fillIn, click, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { Server } from 'mock-socket';

module('Acceptance | socket.io', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /socketio/simple', async function (assert) {
    const done = assert.async();
    const mockServer = new Server('ws://localhost:7100/');

    let counter = 0;
    mockServer.on('message', (data) => {
      const value = JSON.parse(data);

      if (counter === 1) {
        assert.strictEqual(value, 'this is a test 2');
        return mockServer.stop(done);
      }

      assert.strictEqual(value, 'this is a test');
      counter++;
    });

    await visit('/socketio/simple');
    await mockServer.emit('message', 'hello');
    await settled();
    await assert.dom('[data-test-message="0"]').containsText('hello');

    await fillIn('input[type=text]', 'this is a test');
    await click('button');

    await fillIn('input[type=text]', 'this is a test 2');
    await click('button');
  });
});
