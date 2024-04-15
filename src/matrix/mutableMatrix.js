'use strict';

const { Matrix, mutable, immutable } = require('./baseMatrix.js');

class MutableMatrix extends Matrix {}

for (const fnName of immutable) {
  MutableMatrix.prototype[fnName] = function (...args) {
    return Matrix.prototype[fnName].call(this, this, ...args);
  };
}

for (const fnName of mutable) {
  MutableMatrix.prototype[fnName] = function (...args) {
    const matrix = MutableMatrix.fromMatrix(this);
    return Matrix.prototype[fnName].call(this, matrix, ...args);
  };
}

module.exports = MutableMatrix;