'use strict';

const TypedArrayClass = Float32Array;

const SIZE = 4;

class Matrix4x4 {
  #matrix = null;

  constructor(typed) {
    this.#matrix = typed;
  }

  static translate(vector) {
    const matrix = new TypedArrayClass(SIZE * SIZE);
    matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1;
    matrix[3] = vector.x;
    matrix[7] = vector.y;
    matrix[11] = vector.z;
    return new Matrix4x4(matrix);
  }

  static rotate(angle, vector) {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);
    const { x, y, z } = vector;
    const matrix = new TypedArrayClass(SIZE * SIZE);
    matrix[0] = cosa + x * x * (1 - cosa);
    matrix[1] = x * y * (1 - cosa) - z * sina;
    matrix[2] = x * z * (1 - cosa) + y * sina;
    matrix[3] = 0.0;
    matrix[4] = y * x * (1 - cosa) + z * sina;
    matrix[5] = cosa + y * y * (1 - cosa);
    matrix[6] = y * z * (1 - cosa) - x * sina;
    matrix[7] = 0.0;
    matrix[8] = z * x * (1 - cosa) - y * sina;
    matrix[9] = z * y * (1 - cosa) + x * sina;
    matrix[10] = cosa + z * z * (1 - cosa);
    matrix[11] = 0.0;
    matrix[12] = 0.0;
    matrix[13] = 0.0;
    matrix[14] = 0.0;
    matrix[15] = 1.0;
    return new Matrix4x4(matrix);
  }

  static scale(vector) {
    const matrix = new TypedArrayClass(SIZE * SIZE);
    matrix[0] = vector.x;
    matrix[5] = vector.y;
    matrix[10] = vector.z;
    matrix[15] = 1.0;
    return new Matrix4x4(matrix);
  }
}

module.exports = Matrix4x4;
