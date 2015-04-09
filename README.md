# EmberJS WebSockets Addon

This addon aims to be a simple and easy way to integrate with any websocket
backend. It has been designed to be minimalistic, flexible, and lightweight instead of
forcing certain conventions on the developer.

[![Build Status](https://travis-ci.org/thoov/ember-websockets.svg?branch=master)](https://travis-ci.org/thoov/ember-websockets)
[![Code Climate](https://codeclimate.com/github/thoov/ember-websockets/badges/gpa.svg)](https://codeclimate.com/github/thoov/ember-websockets)
[![Ember Observer Score](http://emberobserver.com/badges/ember-websockets.svg)](http://emberobserver.com/addons/ember-websockets)

## Installation

To install as an Ember CLI addon (v0.2.3 or greater):
```
ember install ember-websockets
```

## Simple example of using it in your app

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websocket'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:7000/');

    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', function(event) {
      // anonymous function work as well
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
      // this will return the cached socket and will not create a new one since a socket
      // with the same url already exists
      var socket = this.get('socketService').socketFor('ws://localhost:7000/');
      socket.send('Hello Websocket World');
    }
  }
});
```

In the above example we are simply injecting a service onto our controller. This is not limited to only controllers but in fact can be injected into: components, views, objects, mixins, routes, and of course controllers.

## Multiple Websockets

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websocket'),

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
  socketService: Ember.inject.service('websocket'),

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

## On API

Example:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websocket'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:7000/');

    socket.on('open', this.myOpenFunction, this);
  },

  myOpenFunction: function() {
    console.log('Hello');
  }
});
```

on takes 3 arguments: **event type**, **callback function**, and **context**. Event type can be one of the following: 'open', 'message', 'close', and 'error'. Callback function will be invoked when one of the previous event types occurs. Context is used to set the context of the callback function and also to remove the listeners when the context gets destroyed.

## SocketFor API

Example:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websocket'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:7000/');
  }
});
```

socketFor takes a single argument, **a url**, and returns a socket instance from its cache or a new websocket connection if one was not found.

## CloseSocketFor API

Example:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websocket'),

  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:7000/');

    ...

    this.get('socketService').closeSocketFor('ws://localhost:7000/');
  }
});
```

closeSocketFor takes a single argument, **a url**, and closes the websocket connection. It will also remove it from the cache. In normal cases you would not have to call this method.


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

* **Recommended backend library/framework**: The only requirement for this mixin to work is a service that can handle ws or wss protocols.
For this reason socket.io will not work as it does not use the standard ws protocol. Instead, I would look at [ws](https://github.com/einaros/ws)
which is a great package.

* **Browser Support**: Current support for browsers is fairly good with all modern browsers and most mobile browsers
supporting websockets in their current and previously stable versions. It goes without saying that older versions of IE are
not supported. For a more detailed [break down](http://caniuse.com/#feat=websockets)

* **License**: This addon falls under the [MIT license](https://github.com/thoov/ember-websockets/blob/master/LICENSE.md)
