import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
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
