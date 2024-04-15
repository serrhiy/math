'use strict';

const ImmutableMatrix = require('./immutableMatrix.js');
const MutableMatrix = require('./mutableMatrix.js');

module.exports = {
  ImmutableMatrix,
  MutableMatrix,
  immutable: ImmutableMatrix,
  mutable: MutableMatrix,
};
