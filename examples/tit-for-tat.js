var dilemma = require('../');

function randomResult() {
  return ['C', 'D'][(Math.random() * 2) | 0];
}

dilemma('tit-for-tat', function(results) {
  var opponentPrevious = results.opponent.one();

  return opponentPrevious ? opponentPrevious : randomResult();
});
