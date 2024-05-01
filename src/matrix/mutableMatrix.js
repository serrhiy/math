'use strict';

const { Matrix, mutable, immutable, specials } = require('./baseMatrix.js');

class MutableMatrix extends Matrix {}

for (const fnName of immutable) {
  const staticMethod = fnName in Matrix;
  if (staticMethod) {
    MutableMatrix[fnName] = (...args) => Matrix[fnName](args[0], ...args);
    continue;
  }
  MutableMatrix.prototype[fnName] = function (...args) {
    return Matrix.prototype[fnName].call(this, this, ...args);
  };
}

for (const fnName of mutable) {
  const staticMethod = fnName in Matrix;
  if (staticMethod) {
    MutableMatrix[fnName] = (...args) => {
      const matrix = MutableMatrix.fromMatrix(args[0]);
      return Matrix[fnName](matrix, ...args);
    };
    continue;
  }
  MutableMatrix.prototype[fnName] = function (...args) {
    const matrix = MutableMatrix.fromMatrix(this);
    return Matrix.prototype[fnName].call(this, matrix, ...args);
  };
}

for (const [name, factory] of specials) {
  const staticMethod = name in Matrix;
  if (staticMethod) {
    MutableMatrix[name] = (...args) => {
      const matrix = factory(args[0], ...args);
      return Matrix[name](matrix, ...args);
    };
    continue;
  }
  MutableMatrix.prototype[name] = function (...args) {
    const matrix = factory(this, ...args);
    return Matrix.prototype[name].call(this, matrix, ...args);
  };
}

module.exports = MutableMatrix;
