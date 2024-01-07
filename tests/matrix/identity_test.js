'use strict';

const test = require('node:test');
const assert = require('node:assert').strict;

const { identity } = require('./matrices.js');
const { runTestCases } = require('../utils.js');
const Matrix = require('../../src/matrix/matrix.js');

test('Create identity matrix', () => {
  const equal = identity.map((mat, i) => [i, mat]);
  const exception = [-1, '6', [5], 5.5, () => 4, { n: 5 }];

  const tests = [
    [exception, (arg) => assert.throws(() => Matrix.identity(arg), Error)],
    [
      equal,
      ([arg, expected]) =>
        assert.deepEqual(Matrix.identity(arg).toArray(), expected),
    ],
  ];

  runTestCases(tests);
});
