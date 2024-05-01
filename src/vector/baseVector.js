'use strict';

const Matrix = require('../matrix/immutableMatrix.js');

const DEFAULT_CONSTRUCTOR = Float64Array;

const INNACURACY = 1e-6;

const roughlyEqual = (x, y) => x >= y - INNACURACY && x <= y + INNACURACY;

class Vector {
  #vector = null;
  #vectorConstructor = Vector.DEFAULT_CONSTRUCTOR;

  static fromArray(array, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
    const typed = new TypedArrayClass(array);
    const VectorClass = this;
    return new VectorClass(typed, TypedArrayClass);
  }

  static fromSize(length, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
    if (!Number.isInteger(length) || length < 0) {
      throw new Error(`Unsupported length value for constructor: ${length}`);
    }
    const typed = new TypedArrayClass(length);
    const VectorClass = this;
    return new VectorClass(typed, TypedArrayClass);
  }

  static fromVertex(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error(`Parameter ${vector} is not instance of class Vector`);
    }
    const { constructor: TypedArrayClass } = Object.getPrototypeOf(vector);
    return new this(vector.#vector, TypedArrayClass);
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

  mulOnNumber(destination, x) {
    const map = Vector.prototype.map.bind(this);
    return map(destination, (n) => x * n);
  }

  static sum(destination, vector1, vector2) {
    const otherVector = vector2.#vector;
    const map = Vector.prototype.map.bind(vector1);
    return map(destination, (n, i) => n + otherVector[i]);
  }

  static subtract(destination, vector1, vector2) {
    const otherVector = vector2.#vector;
    const map = Vector.prototype.map.bind(vector1);
    return map(destination, (n, i) => n - otherVector[i]);
  }

  normalize(destination) {
    const length = this.length();
    const mulOnNumber = Vector.prototype.mulOnNumber.bind(this);
    return mulOnNumber(destination, 1 / length);
  }

  isOrthogonalTo(vector) {
    return this.dotProduct(vector) === 0;
  }

  isParallelTo(vector) {
    const { size: thisSize } = this;
    const { size: otherSize } = vector;
    if (thisSize !== otherSize) {
      throw new Error(
        `Vectors are of different dimensions: ${thisSize} and ${otherSize}`,
      );
    }
    const thisVector = this.#vector;
    const otherVector = vector.#vector;
    const div = otherVector[0] ? thisVector[0] / otherVector[0] : 0;
    for (let i = 1; i < thisSize; i++) {
      const x = otherVector[i] ? thisVector[i] / otherVector[i] : 0;
      if (!roughlyEqual(x, div)) return false;
    }
    return true;
  }

  static mixedProduct(...vectors) {
    const { size, VectorConstructor } = vectors[0];
    if (vectors.length !== size) {
      throw new Error('Invalid vectors to find mixed product');
    }
    const matrix = Matrix.fromSize(size, size, VectorConstructor);
    for (let i = 0; i < size; i++) {
      const vector = vectors[i].#vector;
      for (let j = 0; j < size; j++) {
        matrix.set(i, j, vector[j]);
      }
    }
    return matrix.determinant();
  }

  angleBetweenVectors(vector) {
    return Math.acos(
      this.dotProduct(vector) / (this.length() * vector.length()),
    );
  }

  static crossProduct(destination, ...vectors) {
    if (vectors.length === 0) {
      throw new Error('The function crossProduct must accept vectors');
    }
    const firstVector = vectors[0]; 
    const { size } = firstVector;
    const matrix = Matrix.fromSize(size, size, firstVector.#vectorConstructor);
    for (let i = 0; i < size - 1; i++) {
      const vector = vectors[i].#vector;
      for (let j = 0; j < size; j++) {
        matrix.set(i, j, vector[j]);
      }
    }
    const destVector = destination.#vector;
    const adjugated = matrix.adjugate();
    for (let i = 0; i < size; i++) {
      destVector[i] = adjugated.get(i, size - 1);
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

module.exports = {
  Vector,
  functions: [
    'mulOnNumber',
    'sum',
    'subtract',
    'normalize',
    'crossProduct',
    'map',
  ],
};
