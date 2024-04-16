'use strict';

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
}

module.exports = Vector;
