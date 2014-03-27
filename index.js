var debug = require('debug')('dilemma');
var zmq = require('zmq');

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
