var Strategy = require('../strategy');
var strategy = new Strategy({
  title: 'always-trust'
});

strategy
  .connect()
  .on('exec', function() {
    this.submit('C')
  });
