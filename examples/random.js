var dilemma = require('../');

dilemma('random', function() {
  return ['C', 'D'][(Math.random() * 2) | 0];
});
