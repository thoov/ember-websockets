# EmberJS WebSockets Addon

This addon aims to be a simple and easy way to integrate with any websocket
backend. It has been designed to be minimalistic, flexible, and lightweight instead of
forcing certain conventions on the developer.

**NOTE**: This is still a work in progress and is "Alpha" quality. Please note that property
names and methods may change.

## Installation

* `npm install ember-websockets --save-dev`

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

**NOTE** If on your server you send back `JSON.stringify` data then you will need to do a `JSON.parse` within your action!

## Route Mixin Properties

The websocket mixin adds a few properties which you can configure on your route.

* **socketURL** (required): This is the URL of your websocket server. This is of the form `ws://XXX` or `wss://XXX`
* **keepSocketAlive** (optional, default=false): This will tell the mixin whether or not to close the socket when the route transitions away. Set this to true if you want your actions to still be called even if the route is not active.

## FAQ

* recommended backend library/framework: The only requirement for this mixin to work is a service that can handle ws or wss protocols.
For this reason socket.io will not work as it does not use the standard ws protocol. Instead I would look at [ws](https://github.com/einaros/ws)
which is a great package.
