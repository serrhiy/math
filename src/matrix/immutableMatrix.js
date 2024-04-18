'use strict';

const { Matrix, mutable, immutable, specials } = require('./baseMatrix.js');

class ImmutableMatrix extends Matrix {}

for (const fnName of [...mutable, ...immutable]) {
  ImmutableMatrix.prototype[fnName] = function (...args) {
    const matrix = ImmutableMatrix.fromMatrix(this);
    return Matrix.prototype[fnName].call(this, matrix, ...args);
  };
}

for (const [name, factory] of specials) {
  ImmutableMatrix.prototype[name] = function (...args) {
    const matrix = factory(this, ...args);
    return Matrix.prototype[name].call(this, matrix, ...args);
  };
}

module.exports = ImmutableMatrix;
