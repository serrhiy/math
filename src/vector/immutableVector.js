'use strict';

const { Vector, functions } = require('./baseVector.js');

class ImmutableVector extends Vector {}

for (const fnName of functions) {
  const staticMethod = fnName in Vector;
  if (staticMethod) {
    ImmutableVector[fnName] = (...args) => {
      const vector = ImmutableVector.fromVertex(args[0]);
      return Vector[fnName](vector, ...args);
    };
    continue;
  }
  ImmutableVector.prototype[fnName] = function (...args) {
    const vector = ImmutableVector.fromVertex(this);
    return Vector.prototype[fnName].call(this, vector, ...args);
  };
}

module.exports = ImmutableVector;
