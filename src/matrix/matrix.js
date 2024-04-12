'use strict';

class Matrix {
  static DEFAULT_CONSTRUCTOR = Float64Array;
  #rows = 0;
  #cols = 0;
  #matrix = null;

  static identity(size, Constructor = Matrix.DEFAULT_CONSTRUCTOR) {
    if (!Number.isInteger(size) || size < 0) {
      throw new Error('Matrix size must be a non-negative integer');
    }
    const typed = new Constructor(size * size);
    for (let i = 0; i < size; i++) {
      typed[i * (size + 1)] = 1;
    }
    return new Matrix(typed, size, size);
  }

  static fromArray(
    array,
    rows,
    cols,
    Constructor = Matrix.DEFAULT_CONSTRUCTOR,
  ) {
    const { length } = array;
    if (length !== rows * cols) {
      throw new Error(
        `An array with length ${length} cannot be a matrix ` +
          `with ${rows} rows and ${cols} columns`,
      );
    }
    const typed = new Constructor(array);
    return new Matrix(typed, rows, cols);
  }

  static fromNestedArray(matrix, Constructor = Matrix.DEFAULT_CONSTRUCTOR) {
    const plain = matrix.flat(Infinity);
    const rows = matrix.length;
    const cols = matrix[0].length;
    return Matrix.fromArray(plain, rows, cols, Constructor);
  }

  static fromSize(rows, cols, Constructor = Matrix.DEFAULT_CONSTRUCTOR) {
    if (!Number.isInteger(rows) || !Number.isInteger(cols)) {
      throw new Error(
        `Unsupported types for constructor: ${typeof rows} and ${typeof cols}`,
      );
    }
    if (rows < 0 || cols < 0) {
      throw new Error('The indices must be positive integers!');
    }
    if ((rows === 0 && cols !== 0) || (cols === 0 && rows !== 0)) {
      throw new Error(`Invalid arguments: ${rows} and ${cols}`);
    }
    const typed = new Constructor(rows * cols);
    return new Matrix(typed, rows, cols);
  }

  static fromTypedArray(typed, rows, cols) {
    const { constructor: Constructor } = Object.getPrototypeOf(typed);
    const newTyped = new Constructor(typed);
    return new Matrix(newTyped, rows, cols);
  }

  constructor(typedMatrix, rows, cols) {
    this.#matrix = typedMatrix;
    this.#rows = rows;
    this.#cols = cols;
  }

  get(row, col) {
    const index = row * this.#cols + col;
    return this.#matrix[index];
  }

  set(row, col, value) {
    const index = row * this.#cols + col;
    this.#matrix[index] = value;
  }

  get rows() {
    return this.#rows;
  }

  get cols() {
    return this.#cols;
  }

  sum(matrix, destination) {
    const matrixValid = Matrix.validForSum(this, matrix);
    const destValid = Matrix.validForSum(this, destination);
    if (!matrixValid || !destValid) {
      throw new Error(
        'Invalid matrix for sum! ' +
          'The dimensions of the matrices are not identical!',
      );
    }
    const thisMatrix = this.#matrix;
    const otherMatrix = matrix.#matrix;
    return this.map((n, i) => thisMatrix[i] + otherMatrix[i], destination);
  }

  subtract(matrix, destination) {
    const matrixValid = Matrix.validForSum(this, matrix);
    const destValid = Matrix.validForSum(this, destination);
    if (!matrixValid || !destValid) {
      throw new Error(
        'Invalid matrix for subtract! ' +
          'The dimensions of the matrices are not identical!',
      );
    }
    const thisMatrix = this.#matrix;
    const otherMatrix = matrix.#matrix;
    return this.map((n, i) => thisMatrix[i] - otherMatrix[i], destination);
  }

  mulOnNumber(x, destination) {
    return this.map((n) => n * x, destination);
  }

  mul(matrix, destination) {
    if (this.cols !== matrix.rows) {
      throw new Error('Invalid matrix for multiplying!');
    }
    const { cols: thisCols, rows: thisRows } = this;
    const { cols: otherCols } = matrix;
    const destMatrix = destination.#matrix;
    const thisMatrix = this.#matrix;
    const otherMatrix = matrix.#matrix;
    let c = 0,
      t = 0;
    for (let i = 0; i < thisRows; i++) {
      for (let j = 0; j < otherCols; j++) {
        let sum = 0;
        for (let k = 0, r = 0; k < thisCols; k++, r += otherCols) {
          sum += thisMatrix[c + k] * otherMatrix[r + j];
        }
        destMatrix[t + j] = sum;
      }
      c += thisCols;
      t += otherCols;
    }
    return destination;
  }

  compose(matrix, destination) {
    if (this.cols !== matrix.rows) {
      throw new Error('Invalid matrix for multiplying!');
    }
    const { cols: thisCols, rows: thisRows } = this;
    const { cols: otherCols } = matrix;
    const destMatrix = destination.#matrix;
    const thisMatrix = this.#matrix;
    const otherMatrix = matrix.#matrix;
    let c = 0,
      t = 0;
    for (let i = 0; i < thisRows; i++) {
      for (let j = 0; j < otherCols; j++) {
        for (let k = 0, r = 0; k < thisCols; k++, r += otherCols) {
          if (thisMatrix[c + k] && otherMatrix[r + j]) {
            destMatrix[t + j] = 1;
            break;
          }
        }
      }
      c += thisCols;
      t += otherCols;
    }
    return destination;
  }

  booleanProjecion(destination) {
    const length = this.#rows * this.#cols;
    const thisMatrix = this.#matrix;
    const destMatrix = destination.#matrix;
    for (let i = 0; i < length; i++) {
      destMatrix[i] = +!!thisMatrix[i];
    }
    return destination;
  }

  // Gauss-Jordan method
  toUpperTriangle() {
    const { rows, cols } = this;
    const res = Matrix.fromTypedArray(this.#matrix, rows, cols);
    const matrix = res.#matrix;
    let swaps = 0;
    for (let i = 0, c = 0; i < rows - 1 && i < cols; i++, c += cols) {
      // The first column of the matrix from the left
      // that contains at least one non-zero value.

      const nonZeroCol = res.#getNonZeroColIndex(i);
      if (nonZeroCol === -1) break;

      // If the topmost number in this column is zero,
      // then change the entire first row of the matrix from another
      // a row of the matrix where there is no zero in this column.

      if (matrix[c + nonZeroCol] === 0) {
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

      const divider = matrix[c + nonZeroCol] || 1;
      let r = (i + 1) * cols;
      for (let j = i + 1; j < res.rows && j < res.cols; j++) {
        const firstElement = matrix[r + i];
        for (let k = i; k < res.cols; k++) {
          matrix[r + k] -= (matrix[c + k] / divider) * firstElement;
        }
        r += cols;
      }
    }
    return [res, swaps];
  }

  determinant() {
    if (this.#rows !== this.#cols) {
      throw new Error(
        "It's impossible to calculate " +
          'the determinant of a non-square matrix!',
      );
    }
    if (this.#rows === 0 && this.#cols === 0) {
      throw new Error(
        "It's impossible to find the determinant of an empty matrix!",
      );
    }
    const [upperTriangle, swaps] = this.toUpperTriangle();
    let res = 1;
    for (let i = 0; i < this.rows && res !== 0; i++) {
      res *= upperTriangle.get(i, i);
    }
    return swaps % 2 === 0 ? res : -res;
  }

  rank() {
    const [upperTriangle] = this.toUpperTriangle();
    const min = Math.min(this.rows, this.cols);
    let res = min;
    for (let i = 0; i < min && res > 0; i++) {
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

  map(fn, destination, thisArg = null) {
    const mapFn = fn.bind(thisArg);
    const length = destination.#rows * destination.#cols;
    const matrix = this.#matrix;
    const destMatrix = destination.#matrix;
    for (let i = 0; i < length; i++) {
      destMatrix[i] = mapFn(matrix[i], i, this);
    }
    return destination;
  }

  static validForSum(matrix1, matrix2) {
    return matrix1.rows === matrix2.rows && matrix1.cols === matrix2.cols;
  }

  #getNonZeroColIndex(start) {
    const matrix = this.#matrix;
    const rows = this.#rows;
    const cols = this.#cols;
    for (let i = start; i < cols; i++) {
      for (let j = start, k = i; j < rows; j++, k += cols) {
        if (matrix[k] !== 0) return i;
      }
    }
    return -1;
  }

  #getNonZeroColInRowIndex(colIndex, start) {
    const matrix = this.#matrix;
    const index = colIndex * this.#cols;
    for (let i = start; i < this.rows; i++) {
      if (matrix[index + i] !== 0) return i;
    }
    return -1;
  }

  #swapRows(row1Index, row2Index) {
    const cols = this.#cols;
    const matrix = this.#matrix;
    const indexR1 = row1Index * cols;
    const indexR2 = row2Index * cols;
    for (let i = 0; i < cols; i++) {
      const temp = matrix[indexR1 + i];
      matrix[indexR1 + i] = matrix[indexR2 + i];
      matrix[indexR2 + i] = temp;
    }
  }
}

module.exports = Matrix;
