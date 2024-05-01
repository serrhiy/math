'use strict';

const { Vector, functions } = require('./baseVector.js');

class MutableVector extends Vector {}

for (const fnName of functions) {
  const staticMethod = fnName in Vector;
  if (staticMethod) {
    MutableVector[fnName] = (...args) => Vector[fnName](args[0], ...args);
    continue;
  }
  MutableVector.prototype[fnName] = function (...args) {
    return Vector.prototype[fnName].call(this, this, ...args);
  };
}

module.exports = MutableVector;
