# EmberJS WebSockets Addon

This addon aims to be a simple and easy way to integrate with any websocket
backend. It has been designed to be minimalistic, flexible, and lightweight instead of
forcing certain conventions on the developer.

NOTE: This is still a work in progress and is "Alpha" quality. Please note that property
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
  actions: {
    onopen: function(socketEvent) {
      this.send('emit', 'This is some test data I want to send');
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

## Route Mixin Properties

The websocket mixin adds a few properties which you can configure on your route.

* **socketURL** (required): This is the URL of your websocket server. This is of the form `ws://XXX` or `wss://XXX`
* **keepSocketAlive** (optional, default=false): This will tell the mixin whether or not to close the socket when the route transitions away. Set this to true if you want your actions to still be called even if the route is not active.
