'use strict';

const MutableVector = require('./mutableVector.js');
const ImmutableVector = require('./immutableVector.js');

module.exports = {
  MutableVector,
  ImmutableVector,
  mutable: MutableVector,
  immutable: ImmutableVector,
};
