'use strict';

const DEFAULT_CONSTRUCTOR = Float64Array;

class Matrix {
  #rows = 0;
  #cols = 0;
  #matrix = null;
  #matrixConstructor = DEFAULT_CONSTRUCTOR;

  static identity(size, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
    if (!Number.isInteger(size) || size < 0) {
      throw new Error('Matrix size must be a non-negative integer');
    }
    const length = size * size;
    let index = 0;
    const typed = new TypedArrayClass(length);
    while (index <= length) {
      typed[index] = 1;
      index += size + 1;
    }
    const MatrixClass = this;
    return new MatrixClass(typed, size, size, TypedArrayClass);
  }

  static fromArray(array, rows, cols, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
    const { length } = array;
    if (length !== rows * cols) {
      const place = `with ${rows} rows and ${cols} columns`;
      const msg = `An array with length ${length} cannot be a matrix ${place}`;
      throw new Error(msg);
    }
    const typed = new TypedArrayClass(array);
    const MatrixClass = this;
    return new MatrixClass(typed, rows, cols, TypedArrayClass);
  }

  static fromNestedArray(matrix, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
    const plain = matrix.flat(Infinity);
    const rows = matrix.length;
    const cols = matrix[0].length;
    const MatrixClass = this;
    return MatrixClass.fromArray(plain, rows, cols, TypedArrayClass);
  }

  static fromSize(rows, cols, TypedArrayClass = DEFAULT_CONSTRUCTOR) {
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
    const typed = new TypedArrayClass(rows * cols);
    const MatrixClass = this;
    return new MatrixClass(typed, rows, cols, TypedArrayClass);
  }

  static fromTypedArray(typed, rows, cols) {
    const { constructor: TypedArrayClass } = Object.getPrototypeOf(typed);
    const newTyped = new TypedArrayClass(typed);
    const MatrixClass = this;
    return new MatrixClass(newTyped, rows, cols, TypedArrayClass);
  }

  static fromMatrix(matrix) {
    if (!(matrix instanceof Matrix)) {
      throw new Error(`Parameter ${matrix} is not instance of class Matrix`);
    }
    const { rows, cols } = matrix;
    const MatrixClass = this;
    return MatrixClass.fromTypedArray(matrix.#matrix, rows, cols);
  }

  constructor(typedMatrix, rows, cols, matrixConstructor) {
    this.#matrix = typedMatrix;
    this.#rows = rows;
    this.#cols = cols;
    this.#matrixConstructor = matrixConstructor;
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

  get matrixConstructor() {
    return this.#matrixConstructor;
  }

  get matrix() {
    const TypedArrayClass = this.#matrixConstructor;
    return new TypedArrayClass(this.#matrix);
  }

  sum(destination, matrix) {
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
    const map = Matrix.prototype.map.bind(this);
    return map(destination, (n, i) => thisMatrix[i] + otherMatrix[i]);
  }

  subtract(destination, matrix) {
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
    const map = Matrix.prototype.map.bind(this);
    return map(destination, (n, i) => thisMatrix[i] - otherMatrix[i]);
  }

  mulOnNumber(destination, x) {
    const map = Matrix.prototype.map.bind(this);
    return map(destination, (n) => n * x);
  }

  mul(destination, matrix) {
    if (this.cols !== matrix.rows) {
      throw new Error('Invalid matrix for multiplying');
    }
    const { cols: thisCols, rows: thisRows } = this;
    const { cols: otherCols } = matrix;

    const thisMatrix = this.#matrix;
    const otherMatrix = matrix.#matrix;
    const destMatrix = destination.#matrix;
    let c = 0;
    let t = 0;
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

  mulOnVector(vector) {
    const { cols, rows } = this;
    if (cols !== vector.size) {
      throw new Error(
        `It is impossible to multiply a matrix with ${this.cols} ` +
          `rows by a vector of dimension ${vector.size}`,
      );
    }
    const matrix = this.#matrix;
    const typed = new vector.VectorConstructor(cols);
    for (let i = 0, c = 0; i < rows; i++, c += cols) {
      let sum = 0;
      for (let j = 0; j < cols; j++) {
        sum += matrix[c + j] * vector.get(j);
      }
      typed[i] = sum;
    }
    const { constructor: Constructor } = Object.getPrototypeOf(vector);
    return new Constructor(typed, vector.VectorConstructor);
  }

  pow(destination, n) {
    const { cols, rows } = this;
    if (cols !== rows) {
      throw new Error(`It's impossible to exponentiate a non-square matrix!`);
    }
    if (n === 0) {
      return Matrix.identity(rows);
    }
    let cntOfMuls = Math.abs(n);
    const mul = Matrix.prototype.mul.bind(this);
    const inverse = Matrix.prototype.inverse.bind(this);
    let matrix = this;
    while (cntOfMuls > 1) {
      mul(destination, matrix);
      matrix = destination;
      cntOfMuls--;
    }
    return n > 0 ? destination : inverse(destination);
  }

  compose(destination, matrix) {
    if (this.cols !== matrix.rows) {
      throw new Error('Invalid matrix for multiplying!');
    }
    const { cols: thisCols, rows: thisRows } = this;
    const { cols: otherCols } = matrix;
    const destMatrix = destination.#matrix;
    const thisMatrix = this.#matrix;
    const otherMatrix = matrix.#matrix;
    let c = 0;
    let t = 0;
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
    const { rows, cols } = this;
    if (rows !== cols) {
      throw new Error(
        `It's impossible to calculate ` +
          'the determinant of a non-square matrix!',
      );
    }
    if (rows === 0 && cols === 0) {
      throw new Error(
        `It's impossible to find the determinant of an empty matrix!`,
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

  tranpose(destination) {
    const { cols } = this;
    const otherMatrix = destination.#matrix;
    const thisMatrix = this.#matrix;
    for (let i = 0, c = 0; i < this.cols; i++, c += cols) {
      for (let j = 0, t = 0; j < this.rows; j++, t += cols) {
        otherMatrix[c + j] = thisMatrix[t + i];
      }
    }
    return destination;
  }

  minor(row, col) {
    const { rows, cols } = this;
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      throw new Error(
        `Wrong index for finding the minor of the matrix: (${row}, ${col})`,
      );
    }
    const matrix = Matrix.fromSize(rows - 1, cols - 1);
    return this.#crossOut(matrix, row, col).determinant();
  }

  adjugate(destination) {
    const { rows, cols } = this;
    const otherMatrix = destination.#matrix;
    for (let i = 0, c = 0; i < cols; i++, c += cols) {
      for (let j = 0; j < rows; j++) {
        const matrixMinor = this.minor(j, i);
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        otherMatrix[c + j] = sign * matrixMinor;
      }
    }
    return destination;
  }

  inverse(destination) {
    const determinant = this.determinant();
    if (determinant === 0) {
      throw new Error(
        'It is impossible to find the inverse ' +
          'of a matrix if its determinant is 0',
      );
    }
    this.adjugate(destination);
    const mulOnNumber = Matrix.prototype.mulOnNumber.bind(destination);
    return mulOnNumber(destination, 1 / determinant);
  }

  map(destination, fn, thisArg = null) {
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

  #crossOut(destination, row, col) {
    const otherMatrix = destination.#matrix;
    const thisMatrix = this.#matrix;
    const { rows, cols } = this;
    let index = 0;
    for (let i = 0, c = 0; i < rows; i++, c += cols) {
      if (i === row) continue;
      for (let j = 0; j < cols; j++) {
        if (j === col) continue;
        otherMatrix[index] = thisMatrix[c + j];
        index++;
      }
    }
    return destination;
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

module.exports = {
  Matrix,
  mutable: ['compose', 'pow', 'inverse', 'adjugate'],
  immutable: [
    'sum',
    'subtract',
    'mulOnNumber',
    'booleanProjecion',
    'tranpose',
    'map',
  ],
  specials: [
    [
      'mul',
      (m1, ...args) => {
        const { constructor: TypedArrayClass } = Object.getPrototypeOf(m1);
        return TypedArrayClass.fromSize(
          m1.rows,
          args[0].cols,
          m1.matrixConstructor,
        );
      },
    ],
  ],
};
