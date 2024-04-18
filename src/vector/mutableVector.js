'use strict';

const { Vector, functions } = require('./baseVector.js');

class MutableVector extends Vector {}

for (const fnName of functions) {
  MutableVector.prototype[fnName] = function (...args) {
    return Vector.prototype[fnName].call(this, this, ...args);
  };
}

module.exports = MutableVector;
