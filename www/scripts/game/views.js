define(['knockout'], function(ko) {
    
    var GameView = function() {
        this.bombCount = ko.observable(99);
        this.timer = ko.observable(0);
    },
    instance = new GameView();

    ko.applyBindings(instance);

    return {
        gameView: instance
    };

});