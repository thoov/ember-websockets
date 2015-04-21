import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('sockets', function() {
    this.route('chatroom');
    this.route('multichat');
    this.route('dynamic', {path: 'dynamic/:room_id'});
    this.route('services');
  });

  // Used for intergration tests
  this.resource('testing', function() {
    this.route('foo');
    this.route('bar');
    this.route('multi');
    this.route('alive');
    this.route('multi-alive');
    this.route('dynamic', {path: 'dynamic/:room_id'});
  });
});

export default Router;
