/* jshint node: true */
'use strict';

var debug = require('debug')('dilemma-strategy');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var uuid = require('uuid');
var zmq = require('zmq');

function Strategy(opts) {
  if (! (this instanceof Strategy)) {
    return new Strategy(opts);
  }

  // initialise members
  this.id = (opts || {}).id || uuid.v4();
  this.title = (opts || {}).title || '';
  this.target = (opts || {}).target || 'any';

  // create the socket
  this.socket = zmq.socket('req');

  // init the socket identity
  this.socket.identity = 'dilemma-client:' + this.id;
  debug('created client: ' + this.socket.identity);

  // route messages to the processMessage
  this.socket.on('message', this.processMessage.bind(this));
}

util.inherits(Strategy, EventEmitter);
module.exports = Strategy;

var prot = Strategy.prototype;

prot.connect = function(host, port) {
  var uri = 'tcp://' + (host || '127.0.0.1') + ':' + (port || 1441);

  debug(this.socket.identity + ' connecting to: ' + uri);
  this.socket.connect(uri);

  // send the CHALLENGE message
  this.socket.send([
    'reg',
    this.title,
    this.target
  ]);

  return this;
};

prot.processMessage = function(msgType) {
  var payload = [].slice.call(arguments, 1);
  var socket = this.socket;

  switch (msgType.toString()) {
    case 'iterate': {
      debug('received run');

      setTimeout(function() {
        socket.send([ 'upload' ]);
      }, 1000);

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
};

