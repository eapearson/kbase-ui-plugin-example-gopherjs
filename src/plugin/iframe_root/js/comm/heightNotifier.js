define([

], function(config) {
    'use strict';

    function factory(config) {
        var resizeCheckInterval = config.interval;
        var messageManager = config.messageManager;
        var nodeGetter = config.nodeGetter;

        var node;
        var lastHeight;
        var intervalId;

        function getHeight() {
            var node = node || (nodeGetter && nodeGetter());
            if (!node) {
                return;
            }
            var rect = node.getBoundingClientRect();
            return rect.top + rect.bottom + 90;
        }

        function sendSize() {
            messageManager.send('parent', {
                name: 'rendered',
                height: getHeight()
            });
        }

        function listenForResize() {
            lastHeight = getHeight();
            intervalId = window.setInterval(function() {
                var currentHeight = getHeight();
                if (!currentHeight) {
                    return;
                }
                if (lastHeight !== currentHeight) {
                    lastHeight = currentHeight;
                    sendSize();
                }
            }, resizeCheckInterval);
        }

        function start() {
            sendSize();
            listenForResize();
        }

        function stop() {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
        }

        return {
            start: start,
            stop: stop,
            getHeight: getHeight,
            sendSize: sendSize,
            listenForResize: listenForResize
        };
    }

    return {
        make: factory
    };
});