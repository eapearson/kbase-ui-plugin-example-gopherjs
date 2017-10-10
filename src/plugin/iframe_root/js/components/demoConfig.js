define([
    'lib/knockout',
    'lib/html'
], function (
    ko,
    html
) {
    'use strict';
    var t = html.tag,
        span = t('span'),
        div = t('div');

    function viewModel(params) {
        var comm = params.comm;
        var key = ko.observable('services.workspace.url');
        var value = ko.observable();

        /*
        We want to get our key value from the host enviroment by
        sending a messasge to it.
        How do we know about the host environment?
        We are living in a knockout viewModel, in which our data model, or
        whatever we know about the outside world, is brought in through the 
        params argument (there are other arguments, but ignore them for now...)
        It is through the params that we can implement an application model.
        In this case, one of our param properties is guaranteed to be 
        "comm".
        */

        /*
        The comm obejct.
        Our communication with the outside world is actually two layers deep.

        The "hostIntegration" module interacts with the actual iframe host. It is bound 
        the the host or "parent" comm module through a common set of messages. However, we
        don't necessarily want all components to have to master this message api and machinery. 
        Rather, the hostIntegration module provides a simpler and perhaps component-specific comm 
        channel  which may, or may not, be translated into host messages.
        In any case, the component uses the comm channel to communicate with whoever spawned it, and 
        that may make its way into the host layer.
        Comm channels are by their nature asynchronous and implemented, for now, through promises.
        TODO: we may re-implement this through another mechanism which is optional async ... that is the
        async call and sync call are identical, the caller should not care.
        */

        // note - bidirectional
        comm.receive(function (item) {
            switch (item.msg) {
            case 'config-value':
                // it should be ... it is the only thing we would have requested...
                if (item.key === key()) {
                    value(item.value);
                }
                break;
            default:
                return false;
            }
        });

        comm.put({
            msg: 'get-config',
            key: key()
        });

        return {
            key: key,
            value: value
        };
    }

    function template() {
        return div([
            div([
                'Key is ',
                span({
                    dataBind: {
                        text: 'key'
                    }
                })
            ]),
            div([
                'Value is ',
                span({
                    dataBind: {
                        text: 'value'
                    }
                })
            ])

        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }

    return {
        component: component
    };
});