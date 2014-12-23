# EmberJS WebSockets Addon

This addon aims to be a simple and easy way to integrate with any websocket
backend. It has been designed to be minimalistic, flexible, and lightweight instead of
forcing certain conventions on the developer.

[![Build Status](https://travis-ci.org/thoov/ember-websockets.svg?branch=master)](https://travis-ci.org/thoov/ember-websockets)
[![Code Climate](https://codeclimate.com/github/thoov/ember-websockets/badges/gpa.svg)](https://codeclimate.com/github/thoov/ember-websockets)

## Installation

```
npm install ember-websockets --save-dev
```

## Simple example of using it in your app

Import the socket mixin and add it to any route(s) that you wish
to add socket support to:

```javascript
import socketMixin from 'ember-websockets/mixins/sockets';
export default Ember.Route.extend(socketMixin, {
  socketURL: 'ws://localhost:8080'
  // There are a few more options which are explained below
  // including multi socket support
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

## Multiple Socket per Route Support

**NOTE**: If you are just setting up a single connection for a route then use the above
section and skip this one.

You can specify n number of socket connections using the socketConfigurations
property. Here is an example of that:

```javascript
import socketMixin from 'ember-websockets/mixins/sockets';
export default Ember.Route.extend(socketMixin, {
    socketConfigurations: [{
        key: 'socket1',
        socketURL: 'ws://localhost:8001',
    },{
        key: 'socket2',
        socketURL: 'ws://localhost:8002',
        keepSocketAlive: false,
        socketBinaryType: 'blob'
    }]
});
```

**NOTE**: The only required field is socketURL but it is advised to include a key. The
key will allow you to send messages or close individual sockets.

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

All actions are passed with an Event object as the first argument. There are several useful properties which you might
want to use within it but the most important will be **data** and will contain the data sent from the server.

**NOTE**: If on your server you send back `JSON.stringify` data then you will need to do a `JSON.parse` within your action!

If you have specified more than one socket for a given route then those sockets will trigger
onto the same onopen/onmessage/onclose actions on the controller. Below is how you
can handle this:

```javascript
export default Ember.Controller.extend({
    actions: {
        onopen: function(socketEvent) {
            if(socketEvent.origin === 'ws://localhost:8001') {
                console.log('On open for socket1 has been called');
            }
            else {
                console.log('On open for socket2 has been called');
            }
        }
    }
});
```

## Sending events to the server

The websocket mixin adds an action called `emit` onto the route which you can invoke
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

If you have multiple sockets open then you can specify which socket you want the message
to go to. Here is an example of that:

```javascript
export default Ember.Controller.extend({
    chatRoomInputText: null,

    actions: {
        buttonClicked: function() {
            // Note that socket1 is the key used in the socketConfigurations
            // property on the route.
            this.send('emit', this.get('chatRoomInputText'), 'socket1');
        }
    }
});
```

**NOTE**: If you do not include a key then all open sockets will receive the message.

## Closing a connection

The websocket mixin adds an action called `closeSocket` which will close the socket connection:

```javascript
export default Ember.Controller.extend({
    someFunction: function() {
        this.send('closeSocket');
    },

    actions: {
        onclose: function() {
            // This will be called after the
            // closeSocket action has happened
        }
    }
});
```

If you have multiple sockets open then you can specify which socket you want to
close by passing a key. Here is an example of that:

```javascript
export default Ember.Controller.extend({
    someFunction: function() {
        // This will only close the socket1 connections
        this.send('closeSocket', 'socket1');
    }
});
```

**NOTE**: If you do not include a key then all open sockets will close.

## Route Mixin Properties

The websocket mixin adds a few properties which you can configure on your route.

Below are the properties for a **single*** socket connection:

**socketURL** (required): This is the URL of your websocket server. This is of the form `ws://XXX` or `wss://XXX`
**keepSocketAlive** (optional, default=false): This will tell the mixin whether or not to close the socket when the route transitions away. Set this to true if you want your actions to still be called even if the route is not active.
**socketBinaryType** (optional, default='blob'): This will let you specify the type of binary data being transmitted by the connection.
It should be either 'blob' or 'arraybuffer'.

Below is the property setting up **multiple** connections on a single route:

**socketConfigurations** (required): An array of objects that specify how each connections should be set up. Each object should be of this
form:

```javascript
{
    key: 'a unique string that will identify the socket'
    socketURL: 'the socket url',
    keepSocketAlive: false,
    socketBinaryType: 'blob'
}
```

## Using ember-websockets with a non CLI Ember app

First get the assets:
```
npm install ember-websockets --save-dev
```
or
```
git clone git@github.com:thoov/ember-websockets.git
```

After you get the assets include the dist file in your HTML file:
```html
<script src="js/libs/jquery.js"></script>
<script src="js/libs/handlebars.js"></script>
<script src="js/libs/ember.js"></script>
<script src="./path/to/dist/ember-websockets.js"></script>
// Make sure that you include this below your ember.js include
```
This will add the mixin to a global variable called EmberWebsocket.

```js
App.IndexRoute = Ember.Route.extend(window.EmberWebsocket, {
    socketURL: 'ws://localhost:8080'
});
```

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

* **License**: This addon falls under the [MIT license](https://github.com/thoov/ember-websockets/blob/5c6f968a0f857f9ae04d9e702091bd809537c6ec/%20LICENSE.txt)
