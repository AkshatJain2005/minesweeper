define(['zepto', 'random', 'log', 'board', 'views'], function($, r, log, board, views) {

    var middleButtonDown = false,
        gameView = views.gameView;

    $(document).on('click', '.game-area td', function(evt) {
        // Only handle left-click
        if (evt.which != 1) {
            return;
        }
        
        if (gameView.isGameOver()) {
            board.resetGame();
            return;
        }
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');

        board.handleTile(x, y);
    });

    $(document).on('contextmenu', '.game-area td', function(evt) {
        if (gameView.isGameOver()) {
            return;
        }
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');

        board.toggleFlag(x, y);

        evt.preventDefault();
    });
    
    $(document).on('mousedown', '.game-area td', function (evt) {
        if (evt.which != 2) {
            // Only handle middle button
            return;
        }

        if (gameView.isGameOver()) {
            return;
        }
        
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');
            
        board.setMiddleClickShadow(x, y);
        middleButtonDown = true;
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        return false;
    });
    
    $(document).on('mouseenter', '.game-area td', function (evt) {
        if (!middleButtonDown) {
            // Only handle while middle button is pressed
            return;
        }
        
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');
            
        board.setMiddleClickShadow(x, y);
        middleButtonDown = true;
    });
    
    $(document).on('mouseup', '.game-area td', function (evt) {
        if (!middleButtonDown) {
            // Only handle while middle button is pressed
            return;
        }
        
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');

        board.hideMiddleClickShadow();
        middleButtonDown = false;
        board.handleMiddleClick(x, y);
    });
    
    $(document).on('mouseup', function (evt) {
        // Middle button up outside the game area cells
        if (middleButtonDown) {
            board.hideMiddleClickShadow();
            middleButtonDown = false;
        }
    });

    $(document).on('click', '.game-reset', function() {
        var $this = $(this);
        rows = $this.data('rows');
        cols = $this.data('cols');
        bombs = $this.data('bombs');
        log.event('button', $this.text());
        board.resetGameWith(rows, cols, bombs);
    });

    board.resetGame();

});