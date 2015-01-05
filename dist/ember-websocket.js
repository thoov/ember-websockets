(function() {
    var typeOf       = Ember.typeOf;
    var isEmpty      = Ember.isEmpty;
    var socketEvents = ['onclose', 'onerror', 'onmessage', 'onopen'];
    var forEach      = Ember.EnumerableUtils.forEach;

    var EmberWebsocket = Ember.Mixin.create({

        socketURL            : null,
        socketContexts       : {}, // This is shared between all route instances.
        keepSocketAlive      : null,
        socketBinaryType     : null,
        socketConfigurations : null,

        setupController: function(controller) {
            var socketURL            = this.get('socketURL');
            var socketContexts       = this.get('socketContexts');
            var socketBinaryType     = this.get('socketBinaryType');
            var socketConfigurations = this.get('socketConfigurations');

            /*
            * Normalize the single and multi socket configs into one so we can
            * just loop over an array in both cases. IE: a single socket is just
            * an array of one item.
            */
            if(isEmpty(socketConfigurations)) {
                socketConfigurations = [{
                    socketURL: socketURL,
                    binaryType: socketBinaryType,
                    key: 'default'
                }];
            }

            /*
            * Make sure that all of the urls in the configuration are set and valid.
            */
            if(!this.validateSocketConfigurations(socketConfigurations)) {
                this._super.apply(this, arguments);
                return false;
            }

            /*
            * Setup the socketContext object. The object has the following structure:
            *
            * {
            *	'ws://localhost:8080': [{
            *		key: a reference key
            *		websocket: the actual socket object
            *		route: this
            *		controller: the controller which we will send the actions to.
            *	}]
            * }
            */
            var socketsForRoute = this.findSocketsForRoute(this, socketContexts);

            forEach(socketConfigurations, function(socketConfig, index) {
                var urlHashKey       = '';
                var socketKey        = socketConfig.key || 'default_' + index;
                var socketURL        = socketConfig.socketURL;
                var socketBinaryType = socketConfig.socketBinaryType || 'blob';
                var websocket        = this.findSocketByKey(socketConfig.key, socketsForRoute);

                if(!websocket || websocket.readyState === WebSocket.CLOSED) {
                    websocket            = new WebSocket(socketURL);
                    urlHashKey           = websocket.url;
                    websocket.binaryType = socketBinaryType;

                    /*
                    * If we dont have the hashKey in our sh ared object this means we
                    * are creating the first socket for a given url
                    */
                    if(!socketContexts[urlHashKey]) {
                        socketContexts[urlHashKey] = [];
                    }

                    // TODO: can we remove this?
                    this.removeRouteFromContexts(socketContexts, urlHashKey, this);

                    socketContexts[urlHashKey].pushObject({
                        controller : controller,
                        route      : this,
                        websocket  : this.initializeSocket(websocket, socketContexts),
                        key        : socketKey
                    });
                }
            }, this);

            /*
            * Make sure that we call the super function just in case the object
            * who is using this mixin will have their activate function called.
            */
            this._super.apply(this, arguments);
        },

        findSocketsForRoute: function(route, socketContexts) {
            var socketsForRoute = [];

            forEach(Ember.keys(socketContexts), function(key) {
                forEach(socketContexts[key], function(contextObject) {

                    if(route === contextObject.route) {
                        socketsForRoute.push(contextObject);
                    }

                });
            });

            return socketsForRoute;
        },

        findSocketByKey: function(key, arrayOfSockets) {
            var socketForKey = false;

            forEach(arrayOfSockets, function(socketContext) {

                if(socketContext.key === key) {
                    socketForKey = socketContext.websocket;
                }

            });

            return socketForKey;
        },

        /*
        * Overrides the onopen, onmessage, etc methods that get envoked on the socket.
        * This methods will instead send an action and pass along the data coming back.
        */
        initializeSocket: function(websocket, socketContexts) {
            forEach(socketEvents, function(eventName) {
                websocket[eventName] = function(data) {
                    socketContexts[data.currentTarget.url].forEach(function(context) {

                        // Only fire the action on the socket we care about.
                        if(context.websocket === data.target) {
                            context.controller.send(eventName, data);
                        }
                    });
                };
            });

            return websocket;
        },

        /*
        * Validates that an array of socketURLs is set and contains a valid ws or wss protocal url.
        */
        validateSocketConfigurations: function(arrayOfURLs) {
            var wsProtocolRegex = /^(ws|wss):\/\//i;
            var urlsAreValid    = true;

            if(isEmpty(arrayOfURLs) || typeOf(arrayOfURLs) !== 'array') {
                return false;
            }

            forEach(arrayOfURLs, function(socketConfig) {
                var url = socketConfig.socketURL;

                if(isEmpty(url) || !url.match(wsProtocolRegex)) {
                    urlsAreValid = false;
                }
            });

            return urlsAreValid;
        },

        /*
        * TODO: Looking into if we can remove this.
        */
        removeRouteFromContexts: function(socketContexts, socketURL, route) {
            if(socketContexts[socketURL] && socketContexts[socketURL].length > 0) {
                socketContexts[socketURL] = socketContexts[socketURL].rejectBy('route', route);
                return true;
            }

            return false;
        },

        /*
        * When the route deactivates or "transitions away" we will either close the
        * connection or keep it "alive"
        */
        deactivate: function() {
            var socketContexts       = this.get('socketContexts');
            var keepSocketAlive      = this.get('keepSocketAlive');
            var socketConfigurations = this.get('socketConfigurations');
            var socketsForRoute      = this.findSocketsForRoute(this, socketContexts);

            /*
            * Normalize the single and multi socket configs into one so we can
            * just loop over an array in both cases. IE: a single socket is just
            * an array of one item.
            */
            if(!isEmpty(socketConfigurations)) {
                forEach(socketConfigurations, function(config) {
                    var connection = this.findSocketByKey(config.key, socketsForRoute);

                    if(!config.keepSocketAlive && connection && connection.readyState === WebSocket.OPEN) {
                        connection.close();
                    }
                }, this);
            }
            else {
                /*
                * By default within deactivate we will close the connection. If keepSocketAlive
                * is set to true then we will skip this and the socket will not be closed.
                */
                if(!keepSocketAlive) {
                    forEach(socketsForRoute, function(contexts) {
                        if(contexts.websocket && contexts.websocket.readyState === WebSocket.OPEN) {
                            contexts.websocket.close();
                        }
                    });
                }
            }

            this._super.apply(this, arguments);
        },

        actions: {
            /*
            * This is an action that controllers, components, view, etc can send
            * which will make its way to the
            */
            emit: function(data, socketKey, shouldStringify) {
                var socketToEmit    = false;
                var socketContexts  = this.get('socketContexts');
                var socketsForRoute = this.findSocketsForRoute(this, socketContexts);

                if(typeOf(socketKey) === 'boolean') {
                    shouldStringify = socketKey;
                }
                else {
                    socketToEmit = this.findSocketByKey(socketKey, socketsForRoute);
                }

                if(shouldStringify && JSON && JSON.stringify) {
                    data = JSON.stringify(data);
                }

                forEach(socketsForRoute, function(context) {
                    var connection = context.websocket;

                    // Only send the data if we have an active connection
                    if(connection && connection.readyState === WebSocket.OPEN && (!socketToEmit || connection === socketToEmit)) {
                        connection.send(data);
                    }
                });
            },

            /*
            * This action closes the websocket connection. An option socket key can be
            * passed to close a specific socket else all sockets associated with this route
            * will be closed.
            */
            closeSocket: function(socketKey) {
                var socketToClose        = false;
                var socketContexts       = this.get('socketContexts');
                var socketsForRoute      = this.findSocketsForRoute(this, socketContexts);

                if(socketKey) {
                    socketToClose = this.findSocketByKey(socketKey, socketsForRoute);
                }

                forEach(socketsForRoute, function(connection) {
                    if(connection.websocket && (!socketToClose || connection.websocket === socketToClose)) {
                        connection.websocket.close();
                    }
                });
            },

            /*
            * These are just catch alls so we do not get the error message: 'nothing
            * handled this action...'. These should be overridden by the controller.
            */
            onmessage : Ember.K,
            onerror   : Ember.K,
            onopen    : Ember.K,
            onclose   : Ember.K
        }
    });

    window.EmberWebsocket = EmberWebsocket;
})();
