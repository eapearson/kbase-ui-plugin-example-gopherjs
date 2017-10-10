/*global Promise*/
define([
    'lib/knockout',
    'lib/html',
    'lib/chan',
    'lib/props',
    'require'
], function (
    ko,
    html,
    chan,
    props,
    localRequire
) {
    function factory(config) {
        var token;
        var username;
        var config;
        var t = html.tag,
            p = t('p'),
            div = t('div'),
            span = t('span');

        var rootSelector = config.selector,
            root;

        // load components
        function loadComponents() {
            var components = [
                'demoConfig'
            ];
            return Promise.all(components.map(function (component) {
                return new Promise(function (resolve, reject) {
                    localRequire(['components/' + component], function (c) {
                        ko.components.register(component, c.component());
                        resolve();
                    }, function (err) {
                        reject(err);
                    });
                });
            }));
        }

        function render() {
            root.innerHTML = div([
                'I said: Hi, ',
                span(username),
                p('Okay, let us get crackin\''),
                p([
                    'The username above was passed into the app via the integration object, which ',
                    'in turn obtains it via a request of the host via the secure postMessage api.'
                ]),
                p([
                    'Now we\'ll get some configuration data from the host, via the same comm api. ',
                    'Actually, we don\'t need to do that because the config is provided to us during ',
                    'construction anyway, but it demonstrates the point.'
                ]),
                p([
                    'Oh, and we\'ll do that with an embedded knockout component ;)'
                ]),
                div({
                    dataBind: {
                        component: {
                            name: '"demoConfig"',
                            params: {
                                config: 'config',
                                comm: 'comm'
                            }
                        }
                    }
                })
            ]);
            var vm = function () {
                var comm = chan.make();
                comm.receive(function (item) {
                    switch (item.msg) {
                    case 'get-config':
                        comm.put({
                            msg: 'config-value',
                            key: item.key,
                            value: 'you shall receive, one day the value for ' + item.key
                        });
                        break;
                    default:
                        return false;
                    }
                });
                return {
                    config: config,
                    comm: comm
                };
            };
            ko.applyBindings(vm(), root);
        }

        function renderError(err) {
            root.innerHTML = div({
                style: {
                    color: 'red'
                }
            }, [
                'ERROR! ',
                err.message
            ]);
        }

        function start(params) {
            token = params.token;
            username = params.username;
            config = props.make({
                data: params.config
            });

            // bind the app to the selector we are given.
            root = document.querySelector(rootSelector);

            loadComponents()
                .then(function () {
                    render();
                })
                .catch(function (err) {
                    renderError(err);
                });
        }

        function stop() {

        }

        return {
            start: start,
            stop: stop
        };
    }

    return {
        make: factory
    };
});