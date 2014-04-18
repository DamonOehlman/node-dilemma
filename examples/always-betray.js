var Strategy = require('../strategy');
var strategy = new Strategy({
  title: 'always-betray'
});

strategy
  .connect()
  .on('exec', function() {
    this.submit('D')
  });
