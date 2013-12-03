define(['zepto', 'random'], function($, r) {

    var rows = 9, 
    cols = 9, 
    bombs = 10, 
    gameTable, 
    isGameOver = true,
    isFirstMove = true,
    middleButtonDown = false,
    putBombs = function(except) {
        var bCount = bombs, x, y, curr;

        while(bCount > 0) {
            y = r.getRandomInt(0, rows-1);
            x = r.getRandomInt(0, cols-1);
            if(except.x === x && except.y === y) {
                continue;
            }
            curr = gameTable[y][x];
            if (!curr.hasBomb) {
                curr.hasBomb = true;
                bCount--;
            }
        }
    },
    resetGame = function() {
        var i;

        isGameOver = false;
        isFirstMove = true;
        $('body').removeClass('fail').removeClass('win');

        $('.game-area').children().remove();
        gameTable = [];

        for (i = 0; i < rows; i++) {
            gameTable.push(addRow(i));
        }
    }, 
    addRow = function(yIdx) {
        var row = $('<tr></tr>'), i, col, datarow = [];

        for (i = 0; i < cols; i++) {
            col = {
                e: $('<td data-x="' + i + '" data-y="' + yIdx + '"></td>'),
                hasBomb: false,
                x: i,
                y: yIdx
            };
            row.append(col.e);
            datarow.push(col);
        }

        $('.game-area').append(row);
        return datarow;
    }, 
    getNeighbors = function(x, y) {
        var tileArr = [], i, j, curRow, curCol;
        for (i = 0; i < 3; i++) {
            if (i+y-1 < 0 || i+y-1 >= rows) {
                continue;
            }
            curRow = gameTable[i-1+y];
            for (j = 0; j < 3; j++) {
                if (i == 1 && j == 1 || j+x-1 < 0 || j+x-1 >= cols) {
                    continue;
                } 
                curCol = curRow[j-1+x];
                tileArr.push(curCol);
            }
        }
        return tileArr;
    }, 
    findBombs = function(x, y) {
        var bombCount = 0, i, neighbors = getNeighbors(x, y), cur;

        for (i = 0; i < neighbors.length; i++) {
            cur = neighbors[i];
            if (cur.hasBomb) {
                bombCount++;
            }
        }
        return bombCount;
    }, 
    reveal = function(x, y) {
        var bombsFound, i, neighbors, curr, data = gameTable[y][x];

        if(data.e.hasClass('revealed') || data.e.hasClass('flag')) {
            return;
        }
        bombsFound = findBombs(x, y);

        data.e.addClass('revealed');
        data.e.text(bombsFound < 1 ? '' : bombsFound);
        if (bombsFound < 1) {
            neighbors = getNeighbors(x, y);
            for (i = 0; i < neighbors.length; i++) {
                curr = neighbors[i];
                reveal(curr.x, curr.y);
            }
        }
    },
    hasRevealedAllTiles = function() {
        var i, j, currRow, currCol;
        for (i = 0; i < gameTable.length; i++) {
            currRow = gameTable[i];
            for (j = 0; j < gameTable.length; j++) {
                currCol = currRow[j];
                if (!currCol.hasBomb && !currCol.e.hasClass('revealed')) {
                    return false;
                }
            }
        }
        return true;
    },
    revealBombs = function(css) {
        var i, j, currRow, currCol;
        css = css || 'bomb';
        for (i = 0; i < gameTable.length; i++) {
            currRow = gameTable[i];
            for (j = 0; j < currRow.length; j++) {
                currCol = currRow[j];
                if (currCol.hasBomb) {
                    currCol.e.addClass(css);
                }
            }
        }
    },
    handleTile = function(x, y, condition) {
        // Early exit if game is over
        if (isGameOver) {
            return;
        }

        var data = gameTable[y][x];
        
        if (condition) {
            if (!condition(data)) {
                return;
            }
        }

        if (isFirstMove) {
            putBombs({
                x: x,
                y: y
            });
            isFirstMove = false;
        }

        if(data.e.hasClass('flag')) {
            data.e.removeClass('flag');
        } else if(data.hasBomb) {
            isGameOver = true;
            revealBombs();
            $('body').addClass('fail');
            data.e.addClass('hit');
        } else {
            reveal(x, y);
            if (hasRevealedAllTiles()) {
                isGameOver = true;
                $('body').addClass('win');
                revealBombs('flag');
            }
        }
    },
    toggleFlag = function(x, y) {
        var data = gameTable[y][x];

        data.e.toggleClass('flag');

        return false;
    },
    setMiddleClickShadow = function (x, y) {
        hideMiddleClickShadow();
        
        callForMiddleClickArea(x, y, function (x, y) {
            var data = gameTable[y][x];
            data.e.addClass('middle-click-shadow');
        });
        
        middleButtonDown = true;
    },
    hideMiddleClickShadow = function () {
        $('.middle-click-shadow').removeClass('middle-click-shadow');
        middleButtonDown = false;
    },
    callForMiddleClickArea = function (x, y, f) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (gameTable && gameTable[y + j] && gameTable[y + j][x + i]) {
                    f(x + i, y + j);
                }
            }
        }
    },
    handleMiddleClick = function (x, y) {
        callForMiddleClickArea(x, y, function (x, y) {
            handleTile(x, y, function (data) {
                // We only want to reveal unflagged tiles
                return !data.e.hasClass('flag');
            });
        });
    };

    $(document).on('click', '.game-area td', function(evt) {
        // Only handle left-click
        if (evt.which != 1) {
            return;
        }
        
        if (isGameOver) {
            resetGame();
            return;
        }
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');

        handleTile(x, y);
    });

    $(document).on('contextmenu', '.game-area td', function(evt) {
        if (isGameOver) {
            return;
        }
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');

        toggleFlag(x, y);

        evt.preventDefault();
    });
    
    $(document).on('mousedown', '.game-area td', function (evt) {
        if (evt.which != 2) {
            // Only handle middle button
            return;
        }

        if (isGameOver) {
            return;
        }
        
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');
            
        setMiddleClickShadow(x, y);
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
            
        setMiddleClickShadow(x, y);
    })
    
    $(document).on('mouseup', '.game-area td', function (evt) {
        if (!middleButtonDown) {
            // Only handle while middle button is pressed
            return;
        }
        
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y');

        hideMiddleClickShadow();
        handleMiddleClick(x, y);
    });
    
    $(document).on('mouseup', function (evt) {
        // Middle button up outside the game area cells
        if (middleButtonDown) {
            hideMiddleClickShadow();
        }
    });

    $(document).on('click', '.game-reset', function() {
        var $this = $(this);
        rows = $this.data('rows');
        cols = $this.data('cols');
        bombs = $this.data('bombs');
        resetGame();
    });

    resetGame();

});