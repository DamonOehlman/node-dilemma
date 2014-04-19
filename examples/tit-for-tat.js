var dilemma = require('../');

function randomResult() {
  return ['C', 'D'][(Math.random() * 2) | 0];
}

dilemma('tit-for-tat', function(previousResult) {
  var response = previousResult ? previousResult : randomResult();

  this.send(['result', response]);
});
