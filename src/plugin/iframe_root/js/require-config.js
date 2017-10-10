(function (global) {
    var buildKey = new Date().getTime();
    console.log('base?', document.baseURI);
    global.require = {
        // we leave base as the root of the iframe, it is simpler.
        // baseUrl: '/',
        baseUrl: document.baseURI,
        urlArgs: 'cb=' + buildKey,
        catchError: true,
        waitSeconds: 60,
        // paths: {
        //     knockout: '/lib/knockout-latest.debug.js',
        // }
    };
    console.log('done with config');
}(window));