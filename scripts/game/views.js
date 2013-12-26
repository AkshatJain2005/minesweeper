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
    instance;

    GameView.prototype.resetGame = function(bombCount) {
        this.isGameOver(false);
        this.isFirstMove(true);
        this.bombCount(bombCount);
        this.timer(0);
    };

    GameView.prototype.startGame = function() {
        var startTime = new Date(),
            timer = this.timer;

        this.interval = window.setInterval(function() {
            var diff = (new Date()).getTime() - startTime.getTime();
            timer(Math.floor(diff / 1000));
        }, 500);

        this.isFirstMove(false);
    };

    GameView.prototype.stopGame = function(winCondition) {
        window.clearInterval(this.interval);
        this.isGameOver(true);
        this.didWin(winCondition);
    };

    instance = new GameView();

    ko.applyBindings(instance);

    return {
        gameView: instance
    };

});