/*
* The native websocket object will transform urls without a pathname to have just a /.
* As an example: ws://localhost:8080 would actually be ws://localhost:8080/ but ws://example.com/foo would not
* change. This function does this transformation to stay inline with the native websocket implementation.
*/
export function normalizeURL(url) {
  const parsedUrl = new URI(url);
  const path = parsedUrl.path();
  const query = parsedUrl.query();

  if (path === '/') {
    if(query === '' && url.slice(-1) !== '/') {
      return url + '/';
    }

    if(query !== '' && url.indexOf('/?') === -1) {
      return url.replace('?', '/?');
    }
  }

  return url;
}
