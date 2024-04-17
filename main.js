'use strict';

const Vector = require('./src/vector/baseVector.js');
const process = require('node:process');

const printMatrix = (matrix) => {
  const { rows, cols } = matrix;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const string = `${matrix.get(i, j)}\t`;
      process.stdout.write(string);
    }
    process.stdout.write('\n');
  }
};

const vector1 = Vector.fromSize(3);
console.log(vector1.size);