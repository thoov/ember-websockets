# EmberJS WebSockets Addon

This addon aims to be a simple and easy way to integrate with any websocket or socket.io
backend. It has been designed to be minimalistic, flexible, and lightweight instead of
forcing certain conventions on the developer. This addon is compatible with EmberJS 2.0!

[http://www.programwitherik.com/getting-started-with-web-sockets-and-ember/](http://www.programwitherik.com/getting-started-with-web-sockets-and-ember/)

[![Build Status](https://travis-ci.org/thoov/ember-websockets.svg?branch=master)](https://travis-ci.org/thoov/ember-websockets)
[![Code Climate](https://codeclimate.com/github/thoov/ember-websockets/badges/gpa.svg)](https://codeclimate.com/github/thoov/ember-websockets)
[![Ember Observer Score](http://emberobserver.com/badges/ember-websockets.svg)](http://emberobserver.com/addons/ember-websockets)
[![npm version](https://badge.fury.io/js/ember-websockets.svg)](http://badge.fury.io/js/ember-websockets)

## Installation
```
ember install ember-websockets
```

## Simple example of using it in your app

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({

  /*
  * 1) First step you need to do is inject the websocket service into your object. You
  * can inject the service into component, controllers, object, mixins, routes, and views.
  */
  socketService: Ember.inject.service('websockets'),

  init: function() {
    this._super.apply(this, arguments);

    /*
    * 2) The next step you need to do is to create your actual websocket. Calling socketFor
    * will retrieve a cached websocket if one exists or in this case it
    * will create a new one for us.
    */
    var socket = this.get('socketService').socketFor('ws://localhost:7000/');

    /*
    * 3) The final step is to define your event handlers. All event handlers
    * are added via the `on` method and take 3 arguments: event name, callback
    * function, and the context in which to invoke the callback. All 3 arguments
    * are required.
    */
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', function(event) {
      // anonymous functions work as well
    }, this);
  },

  myOpenHandler: function(event) {
    console.log('On open event has been called: ' + event);
  },

  myMessageHandler: function(event) {
    console.log('Message: ' + event.data);
  },

  actions: {
    sendButtonPressed: function() {
      /*
      * If you need to retrieve your websocket from another function or method you can simply
      * get the cached version at no penalty
      */
      var socket = this.get('socketService').socketFor('ws://localhost:7000/');
      socket.send('Hello Websocket World');
    }
  }
});
```

## Sending messages to the server

```javascript
var socket = this.get('socketService').socketFor('ws://localhost:7000/');
socket.send('Hello Websocket World', true);
```

The send method takes 2 arguments. A message which is passed into the native websockets send method and an
optional stringify boolean. This boolean, if set to true, will do a JSON.stringify to the message
before passing it to the websocket send method. If you are sending strings it is recommended to pass true.

## Reconnecting

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:7000/');

    socket.on('open', function(event) {
      console.log('This will be called');
    }, this);

    socket.on('close', function(event) {
      Ember.run.later(this, function() {
        /*
        * This will remove the old socket and try and connect to a new one on the same url.
        * NOTE: that this does not need to be in a Ember.run.later this is just an example on
        * how to reconnect every second.
        */
        socket.reconnect();
      }, 1000);
    }, this);
  }
});
```

## Closing the connection

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),

  /*
  * To close a websocket connection simply call the closeSocketFor method. NOTE: it is good
  * practice to close any connections after you are no longer in need of it. A good
  * place for this clean up is in the willDestroy method of the object.
  */
  willDestroy() {
    this.get('socketService').closeSocketFor('ws://localhost:7000/');
  }
});
```

## Multiple Websockets

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),

  init: function() {
    this._super.apply(this, arguments);

    var socketOne = this.get('socketService').socketFor('ws://localhost:7000/');
    var socketTwo = this.get('socketService').socketFor('ws://localhost:7001/');

    socketOne.on('open', function(event) {
      console.log('Hello from socket one');
    }, this);

    socketTwo.on('open', function(event) {
      console.log('Hello from socket two');
    }, this);
  }
});
```

## Multiple Event Handlers

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:7000/');

    socket.on('open', function(event) {
      console.log('This will be called');
    }, this);

    socket.on('open', function(event) {
      console.log('This will also be called');
    }, this);
  }
});
```

## Socket.IO Support

First run the socket.io generator via:

```shell
ember g socket-io
```

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({

  /*
  * 1) First step you need to do is inject the socketio service into your object.
  */
  socketIOService: Ember.inject.service('socket-io'),

  init: function() {
    this._super.apply(this, arguments);

    /*
    * 2) The next step you need to do is to create your actual socketIO.
    */
    var socket = this.get('socketIOService').socketFor('http://localhost:7000/');

    /*
    * 3) Define any event handlers
    */
    socket.on('connect', function() {
      /*
      * There are 2 ways to send messages to the server: send and emit
      */
      socket.send('Hello World');
      socket.emit('Hello server')
    }, this);

    /*
    * 4) It is also possible to set event handlers on specific events
    */
    socket.on('message', this.onMessage, this);

    socket.on('myCustomNamespace', function() {
      socket.emit('anotherNamespace', 'some data');
    }, this);
  },

  onMessage: function(data) {
    // This is executed within the ember run loop
  }
});
```

**Please visit**: [socket.io docs](https://github.com/thoov/ember-websockets/blob/master/docs/socket-io.md) for more details on ember-websocket + socket.io

## Detailed explanations of the APIs

### SocketFor

Example:

```javascript
var socket = this.get('socketService').socketFor('ws://localhost:7000/', ['myOptionalProtocol']);
```

socketFor takes two arguments: **a url**, **a protocol array** (optional), and returns a socket instance from its cache or a new websocket connection if one was not found.

### On

Example:

```javascript
var socket = this.get('socketService').socketFor('ws://localhost:7000/');

socket.on('open', this.myOpenFunction, this);
```

on takes 3 arguments: **event type**, **callback function**, and **context**. Event type can be one of the following: 'open', 'message', 'close', and 'error'. Callback function will be invoked when one of the event types occurs. Context is used to set the context of the callback function and also to remove the listeners when the context gets destroyed.

### Off

Example:

```javascript
var socket = this.get('socketService').socketFor('ws://localhost:7000/');

socket.on('open', this.myOpenFunction, this);
socket.off('open', this.myOpenFunction);
```

off takes 2 arguments: **event type**, **callback function**. Event type can be one of the following: 'open', 'message', 'close', and 'error'. The callback will be removed from the event pool and will no longer be invoked.

### CloseSocketFor

Example:

```javascript
var socket = this.get('socketService').socketFor('ws://localhost:7000/');

this.get('socketService').closeSocketFor('ws://localhost:7000/');
```

closeSocketFor takes a single argument, **a url**, and closes the websocket connection. It will also remove it from the cache. In normal cases you would not have to call this method.

### Reconnect

Example:

```javascript
socket.on('close', function(event) {
  socket.reconnect();
});
```

reconnect takes no arguments. It will attempt to create a new websocket connect using the previous url.
If the connect is not successful the `close` event will be triggered.

## Deprecations

Before v1.0.0 there was a websocket mixin that you would add to your router and you would define your event
handlers via actions on the controller. If you still need the documentation for this approach [it is here](https://github.com/thoov/ember-websockets/blob/master/docs/deprecated-approach.md).

## Live Example

* `git clone git@github.com:thoov/ember-websockets.git`
* `cd ember-websockets`
* `npm install`
* `ember s`
* Then visit http://localhost:4200/sockets/chatroom to view a very simple example.

The source code for the live example lives in `ember-websockets/tests/dummy`

## Running tests

* `git clone git@github.com:thoov/ember-websockets.git`
* `cd ember-websockets`
* `npm install`
* `ember t`
* or `ember s` then visit http://localhost:4200/tests to view the tests.

**NOTE**: To get the test to run in PhantomJS I created a mocking library found here: [mocking library](https://github.com/thoov/mock-socket) Note that it is still a work in progress.

## Feedback or issues

If you have any feedback, encounter any bugs, or just have a question, please feel free to create a [github issue](https://github.com/thoov/ember-websockets/issues/new) or send me a tweet at [@thoov](https://twitter.com/thoov).

## FAQ

### Recommended backend library/framework
* [ws](https://github.com/einaros/ws)
* [socket.io](http://socket.io)

### Browser Support
Current support for browsers is fairly good with all modern browsers and most mobile browsers
supporting websockets in their current and previously stable versions. It goes without saying that older versions of IE are not supported. For a more detailed [break down](http://caniuse.com/#feat=websockets)

### License
This addon falls under the [MIT license](https://github.com/thoov/ember-websockets/blob/master/LICENSE.md)
