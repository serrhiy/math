'use strict';

const MutableVector = require('./vector/mutableVector.js');
const ImmutableVector = require('./vector/immutableVector.js');

module.exports = {
  MutableVector,
  ImmutableVector,
  mutable: MutableVector,
  immutable: ImmutableVector,
};
