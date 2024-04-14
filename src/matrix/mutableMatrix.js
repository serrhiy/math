'use strict';

const Matrix = require('./matrix.js');

class MutableMatrix extends Matrix {}

const simpleFunctions = [
  'sum',
  'subtract',
  'mulOnNumber',
  'booleanProjecion',
  'tranpose',
  'inverse',
  'map',
];

const specialFunctions = ['mul', 'compose', 'pow'];

for (const fnName of simpleFunctions) {
  MutableMatrix.prototype[fnName] = function (...args) {
    return Matrix.prototype[fnName].call(this, this, ...args);
  };
}

for (const fnName of specialFunctions) {
  MutableMatrix.prototype[fnName] = function (...args) {
    const matrix = MutableMatrix.fromMatrix(this);
    return Matrix.prototype[fnName].call(this, matrix, ...args);
  };
}

module.exports = MutableMatrix;
