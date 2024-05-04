'use strict';

const Vector4 = require('../vector/vector4.js');

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

  mulByMatrix(matrix) {
    const a = this.#matrix;
    const b = matrix.#matrix;
    const result = new TypedArrayClass(SIZE * SIZE);

    result[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    result[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    result[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    result[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

    result[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    result[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    result[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    result[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

    result[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    result[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    result[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    result[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

    result[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    result[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    result[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    result[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

    return new Matrix4x4(result);
  }

  mulByVector(vector) {
    const mat = this.#matrix;
    const { x: vx, y: vy, z: vz, w: vw } = vector;
    const x = mat[0] * vx + mat[1] * vy + mat[2] * vz + mat[3] * vw;
    const y = mat[4] * vx + mat[5] * vy + mat[6] * vz + mat[7] * vw;
    const z = mat[8] * vx + mat[9] * vy + mat[10] * vz + mat[11] * vw;
    const w = mat[12] * vx + mat[13] * vy + mat[14] * vz + mat[15] * vw;
    return new Vector4(x, y, z, w);
  }
}

module.exports = Matrix4x4;
