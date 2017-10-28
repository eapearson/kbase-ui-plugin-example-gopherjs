define([
    'bluebird',
    './comm/iframer'
], function(
    Promise,
    Iframer
) {
    'use strict';

    function factory(config) {
        var container,
            runtime = config.runtime;

        // API

        function attach(node) {
            container = node;
        }

        var iframer;

        function start(params) {
            return Promise.try(function() {
                iframer = Iframer.make({
                    runtime: runtime,
                    node: container,
                    plugin: 'example-gopherjs'
                });

                runtime.send('ui', 'setTitle', 'The GopherJS Experiment');

                return iframer.start();
            });
        }

        function stop() {
            return Promise.try(function() {
                if (iframer) {
                    iframer.stop();
                }
                container.innerHTML = '';
            });
        }

        return {
            attach: attach,
            start: start,
            stop: stop
        };
    }

    return {
        make: function(config) {
            return factory(config);
        }
    };
});
