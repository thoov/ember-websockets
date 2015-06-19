import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('sockets', function() {
    this.route('example');
  });

  this.resource('socketio', function() {
    this.route('simple');
  });
});

export default Router;
