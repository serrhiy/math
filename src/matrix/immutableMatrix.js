'use strict';

const { Matrix, mutable, immutable, specials } = require('./baseMatrix.js');

class ImmutableMatrix extends Matrix {}

for (const fnName of [...mutable, ...immutable]) {
  const staticMethod = fnName in Matrix;
  if (staticMethod) {
    ImmutableMatrix[fnName] = (...args) => {
      const matrix = ImmutableMatrix.fromMatrix(args[0]);
      return Matrix[fnName](matrix, ...args);
    };
    continue;
  }
  ImmutableMatrix.prototype[fnName] = function (...args) {
    const matrix = ImmutableMatrix.fromMatrix(this);
    return Matrix.prototype[fnName].call(this, matrix, ...args);
  };
}

for (const [name, factory] of specials) {
  const staticMethod = name in Matrix;
  if (staticMethod) {
    ImmutableMatrix[name] = (...args) => {
      const matrix = factory(args[0], ...args);
      return Matrix[name](matrix, ...args);
    };
    continue;
  }
  ImmutableMatrix.prototype[name] = function (...args) {
    const matrix = factory(this, ...args);
    return Matrix.prototype[name].call(this, matrix, ...args);
  };
}

module.exports = ImmutableMatrix;
