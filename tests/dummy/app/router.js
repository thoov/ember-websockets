import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

    this.resource('sockets', function() {
        this.route('chatroom');
        this.route('test');
    });

    // Used for intergration tests
    this.resource('testing', function() {
        this.route('foo');
        this.route('bar');
        this.route('multi');
    });
});

export default Router;
