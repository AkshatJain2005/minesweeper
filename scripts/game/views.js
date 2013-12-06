define(['knockout'], function(ko) {
    
    var GameView = function() {
        this.bombCount = ko.observable(99);
        this.isGameOver = ko.observable(false);
        this.didWin = ko.observable(false);
        this.isFirstMove = ko.observable(false);
        this.timer = ko.observable(0);

        this.hasWon = ko.computed(function() {
            return this.isGameOver() && this.didWin();
        }, this);

        this.hasLost = ko.computed(function() {
            return this.isGameOver() && !this.didWin();
        }, this);
    },
    instance = new GameView();

    ko.applyBindings(instance);

    return {
        gameView: instance
    };

});