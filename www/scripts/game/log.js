define([], function() {
   
   var exports = {};

   exports.event = function(action, label) {
       ga('send', 'event', 'minesweeper', action, label);
   };

   return exports;

});