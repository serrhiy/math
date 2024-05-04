'use strict';

const DEFAULT_CONSTRUCTOR = Float32Array;

const SIZE = 4;

class Matrix4x4 {
  #matrix = null;

  constructor(typed) {
    this.#matrix = typed;
  }

  static translate(vector, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
    const matrix = new TypedArrayClass(SIZE * SIZE);
    matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1;
    matrix[3] = vector.x;
    matrix[7] = vector.y;
    matrix[11] = vector.z;
    return new Matrix4x4(matrix);
  }
}

module.exports = Matrix4x4;
