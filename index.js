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