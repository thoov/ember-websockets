# EmberJS WebSockets Addon

This addon aims to be a simple and easy way to integrate with any websocket
backend. It has been designed to be minimalistic, flexible, and lightweight instead of
forcing certain conventions on the developer.

[![Build Status](https://travis-ci.org/thoov/ember-websockets.svg?branch=master)](https://travis-ci.org/thoov/ember-websockets)

## Installation

`npm install ember-websockets --save-dev`

## Simple example of using it in your app

Import the socket mixin and add it to any route(s) that you wish
to add socket support to:

```javascript
import socketMixin from 'ember-websockets/mixins/sockets';
export default Ember.Route.extend(socketMixin, {
  socketURL: 'ws://localhost:8080'
  // There are a few more options which are explained below
});
```

Next set up any actions on your controller which you want handle:

```javascript
export default Ember.Controller.extend({
  actions: {
    onopen: function(socketEvent) {
      console.log('On open has been called!');
    },
    onmessage: function(socketEvent) {
      console.log('On message has been called!');
    }
  }
});
```

## Sending events to the server

The websocket mixin adds an action called `emit` onto the route which you can envoke
within your app. Here is an example:

```javascript
export default Ember.Controller.extend({
  chatRoomInputText: null,

  actions: {
    buttonClicked: function() {
      // This would "emit" the chatRoomInputText to the server.
      this.send('emit', this.get('chatRoomInputText'));
    }
  }
});
```

**NOTE**: Here we are only sending a simple string through the websocket. You can send more complex data types by using
`JSON.stringify`. I have added an optional 3rd parameter which will stringify the data for you. Here is an example:

```javascript
export default Ember.Controller.extend({
  chatRoomInputText: null,
  chatRoomUserName: 'Testing',

  actions: {
    buttonClicked: function() {
      var inputText = this.get('chatRoomInputText'),
          userName = this.get('chatRoomUserName');

      // This would "emit" a custom object through the websocket.
      // Note the argument true. It must be passed if you
      // want to send a custom object like this example.
      this.send('emit', {text: inputText, user: userName}, true);
    }
  }
});
```

## Handling events from the server

There are 4 events that can happen: **onopen, onmessage, onclose, and onerror**. You can add action handlers for any of
these on either your route or controller. Here is an example of all the actions a controller could handle:

```javascript
export default Ember.Controller.extend({
  actions: {
    onopen: function(socketEvent) {
      console.log('On open has been called!');
    },
    onmessage: function(socketEvent) {
      console.log('On message has been called!');
    }
    onclose: function(socketEvent) {
      console.log('On close has been called!');
    }
    onerror: function(socketEvent) {
      console.log('On error has been called! :-(');
    }
  }
});
```

All actions are passed with a Event object as the first argument. There are several useful properties which you might
want to use within it but the most important will be **data** and will contain the data sent from the server.

**NOTE**: If on your server you send back `JSON.stringify` data then you will need to do a `JSON.parse` within your action!

## Route Mixin Properties

The websocket mixin adds a few properties which you can configure on your route.

* **socketURL** (required): This is the URL of your websocket server. This is of the form `ws://XXX` or `wss://XXX`
* **keepSocketAlive** (optional, default=false): This will tell the mixin whether or not to close the socket when the route transitions away. Set this to true if you want your actions to still be called even if the route is not active.

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

**Note**: To get the test to run in PhantomJS I created a mocking library found here: [mocking library](https://github.com/thoov/mock-socket)

## Feedback or issues

If you have any feedback, encounter any bugs, or just have a question, please feel free to create a [github issue](https://github.com/thoov/ember-websockets/issues/new) or send me a tweet at [@thoov](https://twitter.com/thoov).

## FAQ

* **Recommended backend library/framework**: The only requirement for this mixin to work is a service that can handle ws or wss protocols.
For this reason socket.io will not work as it does not use the standard ws protocol. Instead, I would look at [ws](https://github.com/einaros/ws)
which is a great package.

* **Browser Support**: Current support for browsers is fairly good with all modern browsers and most mobile browsers
supporting websockets in their current and previously stable versions. It goes without saying that older versions of IE are
not supported. For a more detailed [break down](http://caniuse.com/#feat=websockets)

* **License**: EmberJS WebSockets addon falls under the [MIT license](https://github.com/thoov/ember-websockets/blob/5c6f968a0f857f9ae04d9e702091bd809537c6ec/%20LICENSE.txt)
