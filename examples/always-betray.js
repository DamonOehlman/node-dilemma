var dilemma = require('../');

dilemma('always-betray', function(previousResult) {
  this.send(['result', 'D']);
});
