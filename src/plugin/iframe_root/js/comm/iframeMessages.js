define([], function() {
    'use strict';

    function factory(config) {
        var root = config.root;
        var name = config.name;

        var partners = {};
        var listeners = {};
        var awaitingResponse = {};

        var lastId;
        var sentCount;
        var receiveCount;

        var id = new Date().getTime();

        function start() {
            root.addEventListener('message', receive, false);
        }

        function stop() {
            root.removeEventListener('message', receive);
        }

        function genId() {
            lastId += 1;
            return 'msg_' + String(lastId);
        }

        function addPartner(config) {
            partners[config.name] = config;
        }

        function listen(listener) {
            if (!listeners.hasOwnProperty(listener.name)) {
                listeners[listener.name] = [];
            }
            listeners[listener.name].push(listener);
        }

        function receive(event) {
            var origin = event.origin || event.originalEvent.origin,
                message = event.data,
                listener, response;

            receiveCount += 1;

            if (message.id && awaitingResponse[message.id]) {
                try {
                    response = awaitingResponse[message.id];
                    delete awaitingResponse[message.id];
                    response.handler(message, event);
                    return;
                } catch (ex) {
                    console.error('Error handling response for message ', message, ex);
                }
            }

            if (listeners[message.name]) {
                listeners[message.name].forEach(function(listener) {
                    try {
                        listener.handler(message);
                        return;
                    } catch (ex) {
                        console.error('Error handling listener for message ', message, ex);
                    }
                });
            }
        }

        function getPartner(name) {
            if (!partners.hasOwnProperty(name)) {
                throw new Error('Partner ' + name + ' not registered');
            }
            return partners[name];
        }

        function send(partnerName, message) {
            var partner = getPartner(partnerName);
            message.from = name;
            sentCount += 1;
            partner.window.postMessage(message, partner.host);
        }

        function sendRequest(partnerName, message, handler) {
            var id = genId();
            message.id = id;
            awaitingResponse[id] = {
                started: new Date(),
                handler: handler
            };
            send(partnerName, message);
        }

        function request(partnerName, message) {
            return new Promise(function(resolve, reject) {
                sendRequest(partnerName, message, function(response) {
                    resolve(response);
                });
            });
        }

        return {
            start: start,
            stop: stop,
            genId: genId,
            addPartner: addPartner,
            listen: listen,
            getPartner: getPartner,
            send: send,
            sendRequest: sendRequest,
            request: request
        };
    }

    return {
        make: factory
    };
});