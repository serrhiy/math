'use strict';


const Matrix = class {

  #matrix = [];

  constructor(a, b) {
    if (this.#isMatrix(a) && typeof n === 'undefined') {
      this.#matrix = structuredClone(a);
      return;
    }

    if (Number.isInteger(a) && Number.isInteger(b)) {

      if (a < 0 || b < 0) {
        throw 'The indices must be positive integers!';
      }

      if ((a === 0 && b !== 0) || (b === 0 && a !== 0)) {
        throw `Invalid arguments: ${a} and ${b}`;
      }

      this.#matrix = new Array(a).fill([]);

      for (let i = 0; i < a; i++) {
        this.#matrix[i] = new Array(b).fill(0);
      }

      return;
    }

    throw `Unsupported types for constructor: ${typeof a} and ${typeof b}`;
  }

  add(mat) {
    const matrix = (mat instanceof Matrix) ? mat : new Matrix(mat);

    if (!this.#isValidForSum(matrix)) {
      throw 'Invalid matrix for sum! ' +
            'The dimensions of the matrices are not identical!';
    }

    return this.map((_, [i, j]) => this.#matrix[i][j] + matrix.#matrix[i][j]);
  }

  subtract(mat) {
    const matrix = (mat instanceof Matrix) ? mat : new Matrix(mat);

    if (!this.#isValidForSum(matrix)) {
      throw 'Invalid matrix for subtract! ' +
            'The dimensions of the matrices are not identical!';
    }

    return this.map((_, [i, j]) => this.#matrix[i][j] - matrix.#matrix[i][j]);
  }

  mulOnNumber(x) {
    if (typeof x !== 'number') {
      throw 'Invalid argument! Argument type must be a number!';
    }

    return this.map((n) => n * x);
  }

  mul(mat) {
    const matrix = (mat instanceof Matrix) ? mat : new Matrix(mat);

    if (this.cols !== matrix.rows) {
      throw 'Invalid matrix for multiplying!';
    }

    const res = new Matrix(this.rows, matrix.cols);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {

        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.#matrix[i][k] * matrix.#matrix[k][j];
        }

        res.#matrix[i][j] = sum;
      }
    }

    return res;
  }

  map(fn, thisArg) {

    const mapFn = fn.bind(thisArg);

    const res = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        res.#matrix[i][j] = mapFn(this.#matrix[i][j], [i, j], this);
      }
    }

    return res;
  }

  get rows() {
    return this.#matrix.length;
  }

  get cols() {
    return this.#matrix[0]?.length ?? 0;
  }

  #isMatrix(matrix) {
    if (!Array.isArray(matrix)) return false;

    const countOfCols = matrix[0]?.length;
    for (const row of matrix) {
      if (!Array.isArray(row)) return false;

      if (row.some((x) => typeof x !== 'number')) return false;

      if (row.length !== countOfCols) return false;
    }

    return true;
  }

  #isValidForSum(matrix) {
    return (this.rows === matrix.rows) && (this.cols === matrix.cols);
  }

};

module.exports = Matrix;

