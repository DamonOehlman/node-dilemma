var dilemma = require('../');

dilemma('random', function(results, callback) {
  callback(null, ['C', 'D'][(Math.random() * 2) | 0]);
});
