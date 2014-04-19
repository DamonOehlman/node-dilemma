var dilemma = require('../');

dilemma('always-trust', function(previousResult) {
  this.send(['result', 'C']);
});
