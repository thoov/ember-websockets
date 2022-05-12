import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { normalizeURL, cleanURL } from 'ember-websockets/helpers';

module('Unit | Helpers | Helper URL Functions', function (hooks) {
  setupTest(hooks);

  test('that normalizeURL works correctly', function (assert) {
    assert.strictEqual(
      normalizeURL('ws://localhost:8000'),
      'ws://localhost:8000/'
    );
    assert.strictEqual(
      normalizeURL('ws://localhost:8000/'),
      'ws://localhost:8000/'
    );
    assert.strictEqual(normalizeURL('ws://example.com'), 'ws://example.com/');
    assert.strictEqual(
      normalizeURL('ws://example.com/foo'),
      'ws://example.com/foo'
    );
    assert.strictEqual(
      normalizeURL('ws://example.com/foo/'),
      'ws://example.com/foo/'
    );
  });

  test('that normalizeURL works correctly if url contains query params', function (assert) {
    assert.strictEqual(
      normalizeURL('ws://example.com/?param=value'),
      'ws://example.com/?param=value'
    );
    assert.strictEqual(
      normalizeURL('ws://example.com?param=value'),
      'ws://example.com/?param=value'
    );
    assert.strictEqual(
      normalizeURL('ws://example.com:8000/?param=value'),
      'ws://example.com:8000/?param=value'
    );
    assert.strictEqual(
      normalizeURL('ws://example.com:8000?param=value'),
      'ws://example.com:8000/?param=value'
    );
    assert.strictEqual(
      normalizeURL('ws://example.com:8000/foo?param=value'),
      'ws://example.com:8000/foo?param=value'
    );
    assert.strictEqual(
      normalizeURL('ws://example.com:8000/foo/?param=value'),
      'ws://example.com:8000/foo/?param=value'
    );
  });

  test('that cleanURL works correctly', function (assert) {
    assert.strictEqual(cleanURL('ws://example.com'), 'ws://examplecom');
    assert.strictEqual(
      cleanURL('ws://example.com?param=foo.bar'),
      'ws://examplecom?param=foobar'
    );
  });
});
