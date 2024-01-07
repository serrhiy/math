'use strict';

const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const { getTestFileNames } = require('./utils.js');

const TEST_FILE_SUFFIX = '_test.js';

const main = () => {
  try {
    const tests = getTestFileNames(__dirname, TEST_FILE_SUFFIX);
    run({ files: tests }).compose(tap).pipe(process.stdout);
  } catch (error) {
    console.log('Error whyle running tests: ' + error);
  }
};

main();
