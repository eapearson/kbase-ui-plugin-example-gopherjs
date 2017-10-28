define([
    'kb_common/html',
    './iframeMessages'
], function (
    html,
    IframeMessages
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        iframe = t('iframe');

    function factory(config) {
        var container = config.node,
            runtime = config.runtime,
            pluginName = config.plugin,
            hostOrigin = document.location.origin,
            iframeOrigin = document.location.origin,
            iframeMessages = IframeMessages.makeHost({
                root: window,
                name: 'panel'
            }),
            theIframe;

        function makeIframe() {
            var frameNumber = html.genId(),
                frameId = 'frame_' + frameNumber,
                iframeIndex = '/modules/plugins/' + pluginName + '/iframe_root/index.html',
                iframeUrl = iframeOrigin + iframeIndex,
                content = div({
                    style: {
                        flex: '1 1 0px',
                        display: 'flex',
                        fiexDirection: 'column'
                    }
                }, [
                    iframe({
                        dataFrame: 'frame_' + frameNumber,
                        dataParams: encodeURIComponent(JSON.stringify({
                            parentHost: hostOrigin,
                            frameId: 'frame_' + frameNumber
                        })),
                        style: {
                            width: '100%',
                            flex: '1 1 0px',
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        frameborder: 0,
                        scrolling: 'no',
                        src: iframeUrl
                    })
                ]);
            return {
                // parentHost: hostOrigin,
                host: iframeOrigin,
                frameNumber: frameNumber,
                frameId: frameId,
                content: content
            };
        }

        function start () {
            theIframe = makeIframe();
            container.innerHTML = theIframe.content;

            iframeMessages.start();

            // ready
            // The ready message is emitted when the app loaded in the iframe
            // has successfully loaded.
            // The frameId in the message must match the frameId known to this
            // iframer instance, which is tied to the iframe it created.
            // The ready message enables the iframeMessages bus for the given
            // iframe based on the iframeId, host, and content window associated
            // with it.
            // It returns a 'start' message in response if the ready request
            // was accepted.
            iframeMessages.listen({
                name: 'ready',
                handler: function(message) {
                    console.log('got ready message!');
                    if (message.frameId !== theIframe.frameId) {
                        console.error('Unexpected "ready"', message, message.frameId, theIframe.frameId);
                        return;
                    }
                    var iframeContentWindow = container.querySelector('[data-frame="frame_' + theIframe.frameNumber + '"]').contentWindow;

                    console.log('adding partner...', message.frameId, theIframe.host, iframeContentWindow);
                    iframeMessages.addPartner({
                        name: message.frameId,
                        host: theIframe.host,
                        window: iframeContentWindow
                    });

                    iframeMessages.send(message.from, {
                        name: 'start'
                    });
                }
            });

            iframeMessages.listen({
                name: 'rendered',
                handler: function(message) {
                    var height = message.height,
                        iframe = container.querySelector('[data-frame="frame_' + theIframe.frameNumber + '"]');
                    iframe.style.height = height + 'px';
                }
            });

            // authStatus
            // Return useful information from the current session authorization,
            // including token  and username.
            iframeMessages.listen({
                name: 'authStatus',
                handler: function(message) {
                    iframeMessages.send(message.from, {
                        name: 'authInfo',
                        id: message.id,
                        token: runtime.service('session').getAuthToken(),
                        username: runtime.service('session').getUsername()
                    });
                }
            });

            // configProperty property
            // Returns a single property (path) from the current config
            iframeMessages.listen({
                name: 'configProperty',
                handler: function(message) {
                    iframeMessages.send(message.from, {
                        name: 'config',
                        id: message.id,
                        value: runtime.config(message.property)
                    });
                }
            });

            // config
            // Returns the current entire raw config object.
            iframeMessages.listen({
                name: 'config',
                handler: function(message) {
                    iframeMessages.send(message.from, {
                        name: 'config',
                        id: message.id,
                        value: runtime.rawConfig()
                    });
                }
            });

            console.log('started iframer :)');
        }

        function stop() {
            container.innerHTML = '';
            return iframeMessages.stop();
        }

        return {
            makeIframe: makeIframe,
            start: start,
            stop: stop
        };
    }

    return {
        make: factory
    };
});
