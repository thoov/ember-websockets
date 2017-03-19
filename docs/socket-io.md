## Socket.IO Support

### Setup

To install the socket.io client library set socketIO to be true in your `config/environment.js` file:

```js
var ENV = {
  'ember-websockets': {
    socketIO: true
  }
};
```

### Usage

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({

  /*
  * 1) First step you need to do is inject the socketio service into your object.
  */
  socketIOService: Ember.inject.service('socket-io'),

  /*
    Important note: The namespace is an implementation detail of the Socket.IO protocol...
    http://socket.io/docs/rooms-and-namespaces/#custom-namespaces
  */
  namespace: '/myCustomNamespace',

  init: function() {
    this._super.apply(this, arguments);

    /*
    * 2) The next step you need to do is to create your actual socketIO.
    */
    var socket = this.get('socketIOService').socketFor('http://localhost:7000/' + this.get('namespace'));

    /*
    * 3) Define any event handlers
    */
    socket.on('connect', function() {

      socket.send('Hello World');

      socket.on('message', this.onMessage, this);

      socket.on('myCustomEvent', function() {
        socket.emit('anotherCustomEvent', 'some data');
      }, this);
    }, this);
  },

  onMessage: function(data) {
    // This is executed within the ember run loop
  }
});
```

### Detailed API Docs

### SocketFor

Example:

```javascript
const socket = this.get('socketService').socketFor('ws://localhost:7000/');
```

socketFor takes a 2 arguments, **a url** and an optional properties **object**, and
returns a socket.io instance from its cache or a new socket.io object if one was not found.

To use a custom namespace, append the namespace to the end of the url.

```javascript
const socket = this.get('socketService').socketFor('ws://localhost:7000/' + namespace);
```

### On

Example:

```javascript
const socket = this.get('socketService').socketFor('ws://localhost:7000/');

socket.on('connect', this.myOpenFunction, this);
```

on takes 3 arguments: **event type**, **callback function**, and **context**. Event type can be any string. Callback function will be invoked once that event types occurs. Context is used to set the context of the callback
function.

### Send

Example:

```javascript
const socket = this.get('socketService').socketFor('ws://localhost:7000/');

socket.on('connect', function() {
  socket.send('My message');
}, this);
```

send takes 1 argument: **message**.

### Emit

Example:

```javascript
const socket = this.get('socketService').socketFor('ws://localhost:7000/');

socket.on('connect', function() {
  socket.emit('myCustomEvent', 'My message');
}, this);
```

emit takes 2 arguments: **event type**, **message**. Emit will send the message via the event type.

### CloseSocketFor

Example:

```javascript
const socket = this.get('socketService').socketFor('localhost:7000/');

socket.on('message', function() {
  this.get('socketService').closeSocketFor('localhost:7000/');
}, this);

socket.on('disconnect', function() {
  console.log('We have disconnected');
}, this);
```

closeSocketFor takes a single argument, **a url**, and closes the socket.io connection. It will also remove it from the cache. In normal cases you would not have to call this method.
