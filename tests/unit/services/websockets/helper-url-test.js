import { module, test } from 'qunit';
import { normalizeURL, cleanURL } from 'ember-websockets/helpers';

module('Sockets Service - Helper URL Functions');

test('that normalizeURL works correctly', assert => {
  assert.expect(5);

  assert.equal(normalizeURL('ws://localhost:8000'), 'ws://localhost:8000/');
  assert.equal(normalizeURL('ws://localhost:8000/'), 'ws://localhost:8000/');
  assert.equal(normalizeURL('ws://example.com'), 'ws://example.com/');
  assert.equal(normalizeURL('ws://example.com/foo'), 'ws://example.com/foo');
  assert.equal(normalizeURL('ws://example.com/foo/'), 'ws://example.com/foo/');
});

test('that normalizeURL works correctly if url contains query params', assert => {
  assert.expect(6);

  assert.equal(normalizeURL('ws://example.com/?param=value'), 'ws://example.com/?param=value');
  assert.equal(normalizeURL('ws://example.com?param=value'), 'ws://example.com/?param=value');
  assert.equal(normalizeURL('ws://example.com:8000/?param=value'), 'ws://example.com:8000/?param=value');
  assert.equal(normalizeURL('ws://example.com:8000?param=value'), 'ws://example.com:8000/?param=value');
  assert.equal(normalizeURL('ws://example.com:8000/foo?param=value'), 'ws://example.com:8000/foo?param=value');
  assert.equal(normalizeURL('ws://example.com:8000/foo/?param=value'), 'ws://example.com:8000/foo/?param=value');
});

test('that cleanURL works correctly', assert => {
  assert.expect(2);

  assert.equal(cleanURL('ws://example.com'), 'ws://examplecom');
  assert.equal(cleanURL('ws://example.com?param=foo.bar'), 'ws://examplecom?param=foobar');
});
