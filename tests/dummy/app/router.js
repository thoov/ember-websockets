import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
   this.route('sockets', function() {
    this.route('example');
  });

  this.route('socketio', function() {
    this.route('simple');
  });
});

export default Router;
