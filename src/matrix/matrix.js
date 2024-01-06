'use strict';


class Matrix {

  #matrix = [];

  static identity(n) {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error('The dimension of the matrix ' +
                      'must be a non-negative integer!');
    }

    const res = new Array(n).fill([]);
    for (let i = 0; i < n; i++) {
      res[i] = new Array(n).fill(0);
      res[i][i] = 1;
    }

    return new Matrix(res);
  }

  constructor(a, b) {
    if (this.#isMatrix(a) && typeof b === 'undefined') {
      this.#matrix = structuredClone(a);
      return;
    }

    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error('Unsupported types for constructor: ' +
                      `${typeof a} and ${typeof b}`);
    }

    if (a < 0 || b < 0) {
      throw new Error('The indices must be positive integers!');
    }
    if ((a === 0 && b !== 0) || (b === 0 && a !== 0)) {
      throw new Error(`Invalid arguments: ${a} and ${b}`);
    }

    this.#matrix = new Array(a).fill([]);
    for (let i = 0; i < a; i++) {
      this.#matrix[i] = new Array(b).fill(0);
    }
  }

  add(mat) {
    const matrix = mat instanceof Matrix ? mat : new Matrix(mat);

    if (!this.#isValidForSum(matrix)) {
      throw new Error('Invalid matrix for sum! ' +
            'The dimensions of the matrices are not identical!');
    }

    return this.map((_, [i, j]) => this.#matrix[i][j] + matrix.#matrix[i][j]);
  }

  subtract(mat) {
    const matrix = mat instanceof Matrix ? mat : new Matrix(mat);

    if (!this.#isValidForSum(matrix)) {
      throw new Error('Invalid matrix for subtract! ' +
            'The dimensions of the matrices are not identical!');
    }

    return this.map((_, [i, j]) => this.#matrix[i][j] - matrix.#matrix[i][j]);
  }

  mulOnNumber(x) {
    if (typeof x !== 'number') {
      throw new Error('Invalid argument! Argument type must be a number!');
    }

    return this.map((n) => n * x);
  }

  mul(mat) {
    const matrix = mat instanceof Matrix ? mat : new Matrix(mat);

    if (this.cols !== matrix.rows) {
      throw new Error('Invalid matrix for multiplying!');
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

  pow(n) {
    if (this.cols !== this.rows) {
      throw new Error('It\'s impossible to exponentiate a non-square matrix!');
    }

    if (!Number.isInteger(n)) {
      throw new Error('The degree of the matrix must be an integer!');
    }

    if (n === 0) {
      return Matrix.identity(this.rows);
    }

    let res = new Matrix(this.#matrix);

    let cntOfMuls = Math.abs(n);

    while (cntOfMuls > 1) {
      res = res.mul(this);
      cntOfMuls--;
    }

    return n > 0 ? res : res.inverse();
  }

  // Gauss-Jordan method
  toUpperTriangle() {
    const res = new Matrix(this.#matrix);

    let swaps = 0;
    for (let i = 0; (i < res.rows - 1) && (i < res.cols); i++) {

      // The first column of the matrix from the left
      // that contains at least one non-zero value.

      const nonZeroCol = res.#getNonZeroColIndex(i);
      if (nonZeroCol === -1) break;

      // If the topmost number in this column is zero,
      // then change the entire first row of the matrix from another
      // a row of the matrix where there is no zero in this column.

      if (res.#matrix[i][nonZeroCol] === 0) {
        const nonZeroRow = res.#getNonZeroColInRowIndex(nonZeroCol, i);
        if (nonZeroRow === -1) continue;

        res.#swapRows(i, nonZeroRow);
        swaps++;
      }

      // The first line is subtracted from the remaining lines,
      // divided by the top element of the selected column and
      // multiplied by the first element of the corresponding string,
      // with the goal of getting the first element of each line
      // (except the first) to be zero.

      const divider = res.#matrix[i][nonZeroCol] || 1;
      for (let j = i + 1; (j < res.rows) && (j < res.cols); j++) {

        const firstElement = res.#matrix[j][i];
        for (let k = i; k < res.cols; k++) {
          res.#matrix[j][k] -= res.#matrix[i][k] / divider * firstElement;
        }
      }

    }

    return [res, swaps];
  }

  determinant() {
    if (this.rows !== this.cols) {
      throw new Error('It\'s impossible to calculate ' +
            'the determinant of a non-square matrix!');
    }

    if (this.rows === 0 && this.cols === 0) {
      throw new Error('It\'s impossible to find the ' +
                      'determinant of an empty matrix!');
    }

    const [upperTriangle, swaps] = this.toUpperTriangle();

    let res = upperTriangle.get(0, 0);
    for (let i = 1; (i < this.rows && res !== 0); i++) {
      res *= upperTriangle.get(i, i);
    }

    return swaps % 2 === 0 ? res : -res;
  }

  rank() {
    const [upperTriangle] = this.toUpperTriangle();

    const min = Math.min(this.rows, this.cols);

    let res = min;
    for (let i = 0; (i < min && res > 0); i++) {

      let allZeros = true;
      for (let j = 0; j < min; j++) {
        if (upperTriangle.get(i, j) !== 0) {
          allZeros = false;
          break;
        }
      }

      res -= allZeros;
    }

    return res;
  }

  tranpose() {
    const res = new Matrix(this.cols, this.rows);

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {

        res.set(i, j, this.#matrix[j][i]);

      }
    }

    return res;
  }

  minor(row, col) {
    return this.#crossOut(row, col).determinant();
  }

  inverse() {
    const determinant = this.determinant();

    if (determinant === 0) {
      throw new Error('It is impossible to find the inverse ' +
                      'of a matrix if its determinant is 0');
    }

    const res = new Array(this.cols).fill([]);
    for (let i = 0; i < this.cols; i++) {

      res[i] = new Array(this.rows).fill(0);
      for (let j = 0; j < this.rows; j++) {

        const matrixMinor = this.minor(j, i);

        const sign = (i + j) % 2 === 0 ? 1 : -1;

        res[i][j] = sign / determinant * matrixMinor;
      }
    }

    return new Matrix(res);
  }

  toArray() {
    return structuredClone(this.#matrix);
  }

  get(row, col) {
    if (!this.#isValidRowIndex(row)) {
      throw new Error(`Invalid row index: ${row}!`);
    }

    if (!this.#isValidColIndex(col)) {
      throw new Error(`Invalid col index: ${col}!`);
    }

    return this.#matrix[row][col];
  }

  set(row, col, value) {
    if (typeof value !== 'number') {
      throw new Error('All elements of the matrix must be numbers!');
    }

    if (!this.#isValidRowIndex(row)) {
      throw new Error(`Invalid row index: ${row}!`);
    }

    if (!this.#isValidColIndex(col)) {
      throw new Error(`Invalid col index: ${col}!`);
    }

    this.#matrix[row][col] = value;
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

  #crossOut(row, col) {
    if (!this.#isValidRowIndex(row)) {
      throw new Error(`Invalid row index: ${row}!`);
    }

    if (!this.#isValidColIndex(col)) {
      throw new Error(`Invalid col index: ${row}!`);
    }

    const res = [];
    for (let i = 0; i < this.rows; i++) {
      if (i === row) continue;

      res.push([]);
      for (let j = 0; j < this.cols; j++) {
        if (j === col) continue;
        res.at(-1).push(this.#matrix[i][j]);
      }

    }

    return new Matrix(res);
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

  #isValidRowIndex(row) {
    return Number.isInteger(row) && (row < this.rows && row >= 0);
  }

  #isValidColIndex(col) {
    return Number.isInteger(col) && (col < this.cols && col >= 0);
  }

  #getNonZeroColIndex(k) {
    for (let i = k; i < this.cols; i++) {

      for (let j = k; j < this.rows; j++) {
        if (this.#matrix[j][i] !== 0) return i;
      }
    }

    return -1;
  }

  #getNonZeroColInRowIndex(colIndex, k) {
    for (let i = k; i < this.rows; i++) {
      if (this.#matrix[i][colIndex] !== 0) return i;
    }

    return -1;
  }

  #swapRows(row1, row2) {
    const temp = this.#matrix[row1];
    this.#matrix[row1] = this.#matrix[row2];
    this.#matrix[row2] = temp;
  }
}

module.exports = Matrix;

