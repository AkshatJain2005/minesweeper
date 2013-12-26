define([], function() {
   
   var exports = {},
       debug = false || (document.location.hostname == "localhost");

   exports.event = function(action, label) {
       ga('send', 'event', 'minesweeper', action, label);
       if (debug) {
           console.log('send', 'event', 'minesweeper', action, label);
       }
   };

   return exports;

});