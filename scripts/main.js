requirejs.config({
    baseUrl: 'scripts/game',
    paths: {
        'zepto': '../lib/zepto.min',
        'bootstrap': '../lib/bootstrap.min',
        'knockout': '../lib/knockout-3.0.0'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        },
        'knockout': {
            exports: 'ko'
        }
    }
});

define(['utils', 'game'], function() {
    require(['othergames'], function() {
    });
});