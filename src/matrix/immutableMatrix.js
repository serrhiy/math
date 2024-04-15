'use strict';

const { Matrix, mutable, immutable } = require('./matrix.js');

class ImmutableMatrix extends Matrix {}

for (const fnName of [...mutable, ...immutable]) {
  ImmutableMatrix.prototype[fnName] = function (...args) {
    const matrix = ImmutableMatrix.fromMatrix(this);
    return Matrix.prototype[fnName].call(this, matrix, ...args);
  };
}

module.exports = ImmutableMatrix;
