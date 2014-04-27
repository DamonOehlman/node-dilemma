var debug = require('debug')('dilemma');
var zmq = require('zmq');
var uuid = require('uuid');
var List = require('collections/list');

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
  var results = createResults();

  function createResults() {
    return {
      local: new List(),
      opponent: new List()
    };
  }

  function getUri() {
    var host = (opts || {}).host || '127.0.0.1';
    var port = (opts || {}).port || 1441;

    return 'tcp://' + host + ':' + port;
  }

  function iterate(lastOpponentResult) {
    if (lastOpponentResult) {
      results.opponent.unshift(lastOpponentResult);
    }

    runner(results, function(err, result) {
      if (err) {
        return socket.send(['error']);
      }

      socket.send([result]);
      results.local.unshift(result);
    });
  }

  function processMessage(msgType) {
    var payload = [].slice.call(arguments, 1).map(toString);
    var response;

    switch (msgType.toString()) {
      case 'iterate': {
        iterate(payload[0]);
        break;
      }

      case 'reset': {
        debug('received reset');
        results = createResults();
        socket.send(['ok']);
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
//   socket.identity = 'dilemma-client:' + ((opts || {}).id || uuid.v4());
  debug('created client: ' + socket.identity);

  // route messages to the processMessage
  socket.on('message', processMessage);

  // connect the socket
  socket.connect(getUri());

  // send the CHALLENGE message
  socket.send([ 'reg', strategyName ]);

  return this;
};
