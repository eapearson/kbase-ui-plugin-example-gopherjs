/* 
chan
A simple implementation of an asynchronous channel.
A channel has listeners to receive new items, a 
queue to hold added items, and can receive new itesm.
*/
define([], function () {
    'use strict';

    function factory(config) {
        if (!config) {
            config = {};
        }
        var queue = [];
        var maxQueueLength = config.bufferSize || 10;
        var receivers = [];
        var timer;

        // If queue length > 0, we set a timer to send messages 
        // on the next clock tick.
        function run(interval) {
            if (queue.length === 0) {
                return;
            }
            if (timer) {
                return;
            }
            if (interval === undefined) {
                interval = 0;
            }
            timer = window.setTimeout(function () {
                var unsent = sendAll();
                // Wait 100ms to run again;
                // TODO: don't spin forever, we need a timeout, probably per item.
                timer = null;
                if (queue.length > 0) {
                    queue = queue.concat(unsent);
                    run();
                } else if (unsent.length > 0) {
                    run(100);
                }
            }, interval);
        }

        function sendAll() {
            // If no receiver yet, we just hang on tight;
            if (receivers.length === 0) {
                return;
            }
            var processing = queue;
            queue = [];
            var unprocessed = [];
            processing.forEach(function (item) {
                if (!receivers.some(function (receiver) {
                        try {
                            return receiver(item) !== false;
                        } catch (ex) {
                            console.error('Error in receiver', ex);
                        }
                    })) {
                    unprocessed.push(item);
                }
            });
            return unprocessed;
        }

        /*
        add item
        Add an item to the channel.
        */
        function put(item) {
            if (maxQueueLength !== Infinity && queue.length >= maxQueueLength) {
                console.warn('max queue length would be exceeded; dropping item', item);
            }
            queue.push(item);
            run();
        }

        function receive(fun) {
            receivers.push(fun);
        }

        return {
            put: put,
            receive: receive
        };
    }

    return {
        make: factory
    };
});