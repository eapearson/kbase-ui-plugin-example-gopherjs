require([
    './kbaseIntegration'
], function(
    KBase
) {
    'use strict';
    var kbase = new KBase();
    kbase.go();
});