'use strict';

const test = require('node:test');
const assert = require('node:assert').strict;
const { Matrix } = require('../../src/matrix/baseMatrix.js');

const TypedArrayClass = Float32Array;

test('identity factory', async (t) => {
  await t.test('empty matrix', () => {
    const actual = new TypedArrayClass(0);
    const identity = Matrix.identity(0, TypedArrayClass);
    const { matrix } = identity;
    assert.deepEqual(actual, matrix);
    assert.equal(0, identity.rows);
    assert.equal(0, identity.cols);
  });

  await t.test('1x1 matrix', () => {
    const actual = new TypedArrayClass([1]);
    const identity = Matrix.identity(1, TypedArrayClass);
    const { matrix, rows, cols } = identity;
    assert.deepEqual(actual, matrix);
    assert.equal(1, rows);
    assert.equal(1, cols);
  });

  await t.test('5x5 matrix', () => {
    const size = 5;
    const actual = new TypedArrayClass([
      1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    ]);
    const identity = Matrix.identity(size, TypedArrayClass);
    const { matrix, rows, cols } = identity;
    assert.deepEqual(actual, matrix);
    assert.equal(size, rows);
    assert.equal(size, cols);
  });

  await t.test('100x100 matrix', () => {
    const size = 100;
    const identity = Matrix.identity(size, TypedArrayClass);
    const { matrix, rows, cols } = identity;
    const sum = matrix.reduce((acc, x) => acc + x);
    assert.equal(size, sum);
    for (let i = 0; i < size * size; i += size + 1) {
      assert.equal(1, matrix[i]);
    }
    assert.equal(size, rows);
    assert.equal(size, cols);
  });
});
