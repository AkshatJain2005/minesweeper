requirejs.config({
    baseUrl: 'scripts/game',
    paths: {
        'zepto': '../lib/zepto.min'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
});

define(['utils', 'game'], function() {

});