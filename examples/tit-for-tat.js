var dilemma = require('../');

function randomResult() {
  return ['C', 'D'][(Math.random() * 2) | 0];
}

dilemma('tit-for-tat', function(results, callback) {
  var opponentPrevious = results.opponent.one();

  return callback(null, opponentPrevious ? opponentPrevious : randomResult());
});
