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
    let i = 0,
      c = 0,
      t = 0;
    while (i < thisRows) {
      for (let j = 0; j < otherCols; j++) {
        let sum = 0;
        for (let k = 0, r = 0; k < thisCols; k++, r += otherCols) {
          sum += thisMatrix[c + k] * otherMatrix[r + j];
        }
        destMatrix[t + j] = sum;
      }
      c += thisCols;
      t += otherCols;
      i++;
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
    let i = 0,
      c = 0,
      t = 0;
    while (i < thisRows) {
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
      i++;
    }
    return destination;
  }

  booleanProjecion(destination) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        destination.set(i, j, +!!this.get(i, j));
      }
    }
    return destination;
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
