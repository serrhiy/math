'use strict';

const fs = require('node:fs');
const path = require('node:path');

const getDirsContent = (path) => fs.readdirSync(path, { withFileTypes: true });

const scanDirectories = (contents, files = []) => {
  for (const content of contents) {
    if (content.isFile()) {
      files.push(content);
    } else if (content.isDirectory()) {
      const dirsPath = path.resolve(content.path, content.name);
      const dirsContent = getDirsContent(dirsPath);
      scanDirectories(dirsContent, files);
    }
  }
  return files;
};

const getTestFileNames = (initialPath, testFileSuffix) => {
  const dirsContent = getDirsContent(initialPath);
  const dirs = dirsContent.filter((content) => content.isDirectory());
  const files = scanDirectories(dirs);
  const testFiles = [];
  for (const file of files) {
    if (file.name.endsWith(testFileSuffix)) {
      testFiles.push(path.resolve(file.path, file.name));
    }
  }
  return testFiles;
};

const runTestCases = (tests) => {
  for (const [args, fn] of tests) {
    for (const arg of args) {
      fn(arg);
    }
  }
};

module.exports = {
  getTestFileNames,
  runTestCases,
};
