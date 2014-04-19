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
module.exports = function(strategyName, opts, runner) {
  // create the socket
  var socket = zmq.socket('req');

  function getUri() {
    var host = (opts || {}).host || '127.0.0.1';
    var port = (opts || {}).port || 1441;

    return 'tcp://' + host + ':' + port;
  }

  function processMessage(msgType) {
    var payload = [].slice.call(arguments, 1).map(toString);

    switch (msgType.toString()) {
      case 'iterate': {
        debug('received iterate - emitting "exec" event', payload[0], payload[0] === null);
        runner.call(socket, payload[0]);

        break;
      }

      case 'end': {
        debug('received end, disconnecting socket');
        socket.close();
        break;
      }

      case 'ping': {
        debug('received ping');
        socket.send(['pong']);
        break;
      }

      default: {
        debug('received unknown message of type: ' + msgType, payload);
      }
    }
  }

  function toString(val) {
    return (val && typeof val.toString == 'function') ? val.toString() : val;
  }


  // remap args if required
  if (typeof opts == 'function') {
    runner = opts;
    opts = {};
  }

  // init the socket identity
  socket.identity = 'dilemma-client:' + ((opts || {}).id || uuid.v4());
  debug('created client: ' + socket.identity);

  // route messages to the processMessage
  socket.on('message', processMessage);

  // connect the socket
  socket.connect(getUri());

  // send the CHALLENGE message
  socket.send([ 'reg', strategyName ]);

  return this;
};
