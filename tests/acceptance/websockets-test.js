import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import { Server as MockServer } from 'mock-socket';

module('Acceptance | websockets', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /websockets', async function(assert) {
    const done = assert.async();
    const mockServer = new MockServer('ws://localhost:8080/foo/bar');

    let counter = 0;
    mockServer.on('message', (data) => {
      const value = JSON.parse(data);

      if (counter === 1) {
        assert.equal(value, 'this is a test 2');
        return mockServer.stop(done);
      }

      assert.equal(value, 'this is a test');
      counter++;
    });

    await visit('/sockets/example');

    fillIn('input[type=text]', 'this is a test');
    click('button');

    fillIn('input[type=text]', 'this is a test 2');
    click('button');
  });
});

