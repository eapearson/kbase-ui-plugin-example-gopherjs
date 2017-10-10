define([
    './comm/iframeMessages',
    './comm/heightNotifier',
    './app'
], function(
    IFrameMessages,
    HeightNotifier,
    App
) {

    function factory(config) {
        var mainNode;
        var params;
        var messageManager;
        var token;
        var username;
        var config;
        var app;
        var heightNotifier;

        // getParams
        // Communicating initial parameters through a json value embedded in the 
        // iframe container in the attribute "data-params"
        function getParams() {
            if (!window.frameElement.hasAttribute('data-params')) {
                return;
            }
            params = JSON.parse(decodeURIComponent(window.frameElement.getAttribute('data-params')));
        }

        // MAIN
        getParams();
        messageManager = IFrameMessages.make({
            root: window,
            name: params.frameId
        });
        app = App.make({
            selector: '#app'
        });

        var KBase = {};

        function start(message) {
            messageManager.request('parent', {
                    name: 'authStatus'
                })
                .then(function(authStatus) {
                    KBase.token = authStatus.token;
                    KBase.username = authStatus.username;
                    return messageManager.request('parent', {
                        name: 'config'
                    });
                })
                .then(function(result) {
                    KBase.config = result.value;
                    return app.start({
                        token: KBase.token,
                        username: KBase.username,
                        config: KBase.config
                    });
                })
                .then(function() {
                    heightNotifier = HeightNotifier.make({
                        interval: 200,
                        messageManager: messageManager,
                        nodeGetter: function() {
                            return document.querySelector('md-sidenav-layout .content');
                        }
                    });
                    return heightNotifier.start();
                })
                .catch(function(err) {
                    console.error('ERORR', err);
                });
        }

        function stop(message) {}

        function go() {
            messageManager.start();

            messageManager.addPartner({
                name: 'parent',
                window: window.parent,
                host: params.parentHost
            });

            messageManager.listen({
                name: 'start',
                handler: function(message) {
                    start(message);
                }
            });

            messageManager.listen({
                name: 'stop',
                handler: function(message) {
                    stop(message);
                }
            });

            messageManager.send('parent', {
                name: 'ready',
                frameId: params.frameId
            });
        }

        return {
            go: go,
            start: start,
            stop: stop
        };
    }

    return factory;
});