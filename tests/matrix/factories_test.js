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

test('fromArray factory', async (t) => {
  await t.test('empty matrix', () => {
    const size = 0;
    const actual = new TypedArrayClass(size);
    const matrix = Matrix.fromArray([], size, size, TypedArrayClass);
    const { matrix: typedArray, rows, cols } = matrix;
    assert.deepEqual(actual, typedArray);
    assert.equal(0, rows);
    assert.equal(0, cols);
  });

  await t.test('1x1 matrix', () => {
    const size = 1;
    const array = [5];
    const actual = new TypedArrayClass(array);
    const matrix = Matrix.fromArray(array, size, size, TypedArrayClass);
    const { matrix: typedArray, rows, cols } = matrix;
    assert.deepEqual(actual, typedArray);
    assert.equal(size, rows);
    assert.equal(size, cols);
  });

  await t.test('3x2 matrix', () => {
    const rows = 3;
    const cols = 2;
    const array = [1, 2, 3, 4, 5, 6];
    const actual = new TypedArrayClass(array);
    const matrix = Matrix.fromArray(array, rows, cols, TypedArrayClass);
    const { matrix: typedArray, rows: r, cols: c } = matrix;
    assert.deepEqual(actual, typedArray);
    assert.equal(rows, r);
    assert.equal(cols, c);
  });

  await t.test('5x5 matrix', () => {
    const size = 5;
    const array = Array.from({ length: size * size }, Math.random);
    const actual = new TypedArrayClass(array);
    const matrix = Matrix.fromArray(array, size, size, TypedArrayClass);
    const { matrix: typedArray, rows, cols } = matrix;
    assert.deepEqual(actual, typedArray);
    assert.equal(size, rows);
    assert.equal(size, cols);
  });

  await t.test('invalid dimension', () => {
    const rows = 3;
    const cols = 2;
    const array = [1, 2, 3];
    assert.throws(() => Matrix.fromArray(array, rows, cols));
  });
});
