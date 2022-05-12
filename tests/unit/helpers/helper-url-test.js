import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { normalizeURL, cleanURL } from 'ember-websockets/helpers';

module('Unit | Helpers | Helper URL Functions', function (hooks) {
  setupTest(hooks);

  test('that normalizeURL works correctly', function (assert) {
    assert.equal(normalizeURL('ws://localhost:8000'), 'ws://localhost:8000/');
    assert.equal(normalizeURL('ws://localhost:8000/'), 'ws://localhost:8000/');
    assert.equal(normalizeURL('ws://example.com'), 'ws://example.com/');
    assert.equal(normalizeURL('ws://example.com/foo'), 'ws://example.com/foo');
    assert.equal(
      normalizeURL('ws://example.com/foo/'),
      'ws://example.com/foo/'
    );
  });

  test('that normalizeURL works correctly if url contains query params', function (assert) {
    assert.equal(
      normalizeURL('ws://example.com/?param=value'),
      'ws://example.com/?param=value'
    );
    assert.equal(
      normalizeURL('ws://example.com?param=value'),
      'ws://example.com/?param=value'
    );
    assert.equal(
      normalizeURL('ws://example.com:8000/?param=value'),
      'ws://example.com:8000/?param=value'
    );
    assert.equal(
      normalizeURL('ws://example.com:8000?param=value'),
      'ws://example.com:8000/?param=value'
    );
    assert.equal(
      normalizeURL('ws://example.com:8000/foo?param=value'),
      'ws://example.com:8000/foo?param=value'
    );
    assert.equal(
      normalizeURL('ws://example.com:8000/foo/?param=value'),
      'ws://example.com:8000/foo/?param=value'
    );
  });

  test('that cleanURL works correctly', function (assert) {
    assert.equal(cleanURL('ws://example.com'), 'ws://examplecom');
    assert.equal(
      cleanURL('ws://example.com?param=foo.bar'),
      'ws://examplecom?param=foobar'
    );
  });
});
