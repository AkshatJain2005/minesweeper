define(['zepto', 'random'], function($, r) {

    var rows = 10, cols = 10, resetGame = function() {
        var i;

        $('.game-area').children().remove();

        for (i = 0; i < rows; i++) {
            addRow();
        }
    }, addRow = function() {
        var row = $('<tr></tr>'), i;

        for (i = 0; i < cols; i++) {
            row.append('<td></td>');
        }

        $('.game-area').append(row);
    };

    $(document).on('click', '.game-area td', function() {
        $(this).css('background-color', 'red');
    });

    $(document).on('click', '.game-reset', function() {
        resetGame();
    });

    resetGame();

});