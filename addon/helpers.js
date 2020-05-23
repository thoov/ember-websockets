/*
* The native websocket object will transform urls without a pathname to have just a /.
* As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
* change. This function does this transformation to stay inline with the native websocket implementation.
*/
export function normalizeURL(url) {
  return new URL(url).toString();
}

/*
* Since the url will be used as a key will need to make sure that it does not
* contain '.' as it will throw ember off
*/
export function cleanURL(url) {
  return url.replace(/\./g, '');
}
