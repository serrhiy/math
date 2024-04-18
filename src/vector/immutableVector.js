'use strict';

const { Vector, functions } = require('./baseVector.js');

class ImmutableVector extends Vector {}

for (const fnName of functions) {
  ImmutableVector.prototype[fnName] = function (...args) {
    const vector = ImmutableVector.fromVertex(this);
    return Vector.prototype[fnName].call(this, vector, ...args);
  };
}

module.exports = ImmutableVector;
