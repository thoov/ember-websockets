import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

import { Server as MockServer } from 'mock-socket';

moduleForAcceptance('Acceptance | websockets');

test('visiting /websockets', function(assert) {
  var done = assert.async();
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

  visit('/sockets/example');

  andThen(function() {
    fillIn('input[type=text]', 'this is a test');
    click('button');
    
    fillIn('input[type=text]', 'this is a test 2');
    click('button');
  });
});
