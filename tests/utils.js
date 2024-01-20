'use strict';

const runTestCases = (tests) => {
  for (const [args, fn] of tests) {
    for (const arg of args) {
      fn(arg);
    }
  }
};

module.exports = {
  runTestCases,
};
