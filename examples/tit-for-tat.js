var Strategy = require('../strategy');
var strategy = new Strategy({
  title: 'tit-for-tat'
});

function randomResult() {
  return ['C', 'D'][(Math.random() * 2) | 0];
}

strategy
  .connect()
  .on('exec', function(lastResult) {
    this.submit(lastResult ? lastResult : randomResult());
  });
