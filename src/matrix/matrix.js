'use strict';

class Matrix {
  static DEFAULT_CONSTRUCTOR = Float64Array;
  #rows = 0;
  #cols = 0;
  #matrix = null;

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
}

module.exports = Matrix;
