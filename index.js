var debug = require('debug')('dilemma');
var zmq = require('zmq');
var uuid = require('uuid');

/**
  # dilemma

  This is a host runner for executing strategies writtem in JS for the
  [prisoners dilemma](http://en.wikipedia.org/wiki/Prisoner's_dilemma) game
  theory problem.  Additionally it can be used interface with program that
  can be executed and works with `stdio`.

  ## Command Line Usage

  The reason both this package and the
  [dilemma-server](https://github.com/DamonOehlman/dilemma-server) exist is
  to encourage experimentation with different languages, providing you
  the opportunities to focus on implementing clever algorithms rather than
  lots of boiler plate code.


  ## Programmatic Usage (JS Only)

**/

module.exports = function(name) {
  return function(strategy, opts) {
    var host = (opts || {}).host || '127.0.0.1';
    var port = (opts || {}).port || 1441;

    function handleMessage(msgType) {
      var payload = [].slice.call(arguments, 1);

      switch (msgType.toString()) {
        case 'run': {
          debug('received run');
          break;
        }

        case 'end': {
          debug('received end, disconnecting socket');
          this.close();
          break;
        }

        default: {
          debug('received unknown message of type: ' + msgType, payload);
        }
      }
    }

    return function(target) {
      var socket = zmq.socket('req');

      // connect
      socket.identity = 'dilemma-client:' + uuid.v4();
      socket.connect('tcp://' + host + ':' + port);
      debug('created client: ' + socket.identity);

      // wait for the response
      // socket.once('data', function())
      socket.on('message', handleMessage);

      debug('sending reg');
      // send the CHALLENGE message
      socket.send(['reg', name, target || 'any' ]);
    }
  };
};
