'use strict';

const ImmutableMatrix = require('./matrix/immutableMatrix.js');
const MutableMatrix = require('./matrix/mutableMatrix.js');

module.exports = {
  ImmutableMatrix,
  MutableMatrix,
  immutable: ImmutableMatrix,
  mutable: MutableMatrix,
};
