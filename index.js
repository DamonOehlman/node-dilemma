var debug = require('debug')('dilemma');
var zmq = require('zmq');

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
    var socket = zmq.socket('req');

    function handleMessage(msgType) {
      var payload = [].slice.call(arguments, 1);

      switch (msgType.toString()) {
        case 'run': {

        }

        case 'end': {
          debug('received end, disconnecting socket');
          socket.close();
          break;
        }

        default: {
          debug('received unknown message of type: ' + msgType, payload);
        }
      }
    }

    // connect
    socket.connect('tcp://' + host + ':' + port);

    // wait for the response
    // socket.once('data', function())
    socket.on('message', handleMessage);

    return function(target) {
      // send the CHALLENGE message
      socket.send(['reg', name, target || 'any' ]);
    }
  };
};
