'use strict';

const Matrix = require('../matrix/matrix.js').mutable;

class Vector {
  static DEFAULT_CONSTRUCTOR = Float64Array;
  #vector = null;
  #vectorConstructor = Vector.DEFAULT_CONSTRUCTOR;

  static fromArray(array, Constructor = Vector.DEFAULT_CONSTRUCTOR) {
    const typed = new Constructor(array);
    return new this(typed, Constructor);
  }

  static fromSize(length, Constructor = Vector.DEFAULT_CONSTRUCTOR) {
    if (!Number.isInteger(length) || length < 0) {
      throw new Error(`Unsupported length value for constructor: ${length}`);
    }
    const typed = new Constructor(length);
    return new this(typed, Constructor);
  }

  static fromVertex(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error(`Parameter ${vector} is not instance of class Vector`);
    }
    const { constructor: Constructor } = Object.getPrototypeOf(vector);
    return new this(vector.#vector, Constructor);
  }

  constructor(typed, vectorConstructor) {
    this.#vector = typed;
    this.#vectorConstructor = vectorConstructor;
  }

  get(i) {
    return this.#vector[i];
  }

  set(i, value) {
    this.#vector[i] = value;
  }

  get size() {
    return this.#vector.length;
  }

  get VectorConstructor() {
    return this.#vectorConstructor;
  }

  length() {
    const length = this.#vector.reduce((acc, x) => acc + x * x, 0);
    return Math.sqrt(length);
  }

  dotProduct(vector) {
    const thisVector = this.#vector;
    const otherVector = vector.#vector;
    if (thisVector.length !== otherVector.length) {
      throw new Error(
        'It is impossible to find the dot product of different dimensional vectors',
      );
    }
    return thisVector.reduce((acc, n, i) => acc + n * otherVector[i], 0);
  }

  nulOnNumber(destination, x) {
    const map = Vector.prototype.map.bind(this);
    return map(destination, (n) => x * n);
  }

  sum(destination, vector) {
    const otherVector = vector.#vector;
    const map = Vector.prototype.map.bind(this);
    return map(destination, (n, i) => n + otherVector[i]);
  }

  subtract(destination, vector) {
    const otherVector = vector.#vector;
    const map = Vector.prototype.map.bind(this);
    return map(destination, (n, i) => n - otherVector[i]);
  }

  angleBetweenVectors(vector) {
    return Math.acos(
      this.dotProduct(vector) / (this.length() * vector.length()),
    );
  }

  crossProduct(destination, ...vectors) {
    if (vectors.length === 0) {
      throw new Error('The function crossProduct must accept vectors');
    }
    vectors.unshift(this);
    const { length } = this.#vector;
    const matrix = Matrix.fromSize(length, length, this.#vectorConstructor);
    for (let i = 0; i < length - 1; i++) {
      const vector = vectors[i].#vector;
      for (let j = 0; j < length; j++) {
        matrix.set(i, j, vector[j]);
      }
    }
    const destVector = destination.#vector;
    const adjugated = matrix.adjugate();
    for (let i = 0; i < length; i++) {
      destVector[i] = adjugated.get(i, length - 1);
    }
    return destination;
  }

  map(destination, fn, thisArg) {
    const mapFn = fn.bind(thisArg);
    const destVector = destination.#vector;
    const thisVector = this.#vector;
    const { length } = thisVector;
    for (let i = 0; i < length; i++) {
      destVector[i] = mapFn(thisVector[i], i, this);
    }
    return destination;
  }
}

module.exports = Vector;
