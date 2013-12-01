requirejs.config({
    baseUrl: 'scripts/game',
    paths: {
        'zepto': '../lib/zepto.min',
        'bootstrap': '../lib/bootstrap.min'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
});

define(['zepto', 'utils', 'game', 'othergames'], function($) {
});