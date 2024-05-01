
import { TypedArray } from './types';

declare class ImmutableMatrix {
  static identity(size: number, TypedArrayClass: TypedArray): ImmutableMatrix;
  static fromArray(array: number[], rows: number, cols: number, TypedArrayClass: TypedArray): ImmutableMatrix;
  static fromNestedArray(matrix: ImmutableMatrix, TypedArrayClass: TypedArray): ImmutableMatrix;
  static fromSize(rows: number, cols: number, TypedArrayClass: TypedArray): ImmutableMatrix;
  static fromTypedArray(typed: TypedArray, rows: number, cols: number): ImmutableMatrix;
  static validForSum(matrix1: ImmutableMatrix, matrix2: ImmutableMatrix): boolean;
  static fromMatrix(matrix: ImmutableMatrix): ImmutableMatrix;
  constructor(typedMatrix: TypedArray, rows: number, cols: number, matrixConstructor: TypedArray);
  get(row: number, col: number): number;
  set(row: number, col: number, value: number): void;
  get rows(): number;
  get cols(): number;
  get matrixConstructor(): TypedArray;
  static sum(matrix1: ImmutableMatrix, matrix2: ImmutableMatrix): ImmutableMatrix;
  static subtract(matrix1: ImmutableMatrix, matrix2: ImmutableMatrix): ImmutableMatrix;
  mulOnNumber(x: number): ImmutableMatrix;
  static mul(matrix1: ImmutableMatrix, matrix2: ImmutableMatrix): ImmutableMatrix;
  mulOnVector(vector: any): ImmutableMatrix;
  pow(n: number): ImmutableMatrix;
  static compose(matrix1: ImmutableMatrix, matrix2: ImmutableMatrix): ImmutableMatrix;
  booleanProjecion(): ImmutableMatrix;
  toUpperTriangle(): ImmutableMatrix;
  determinant(): number;
  rank(): number;
  tranpose(): ImmutableMatrix;
  minor(row: number, col: number): number;
  adjugate(): ImmutableMatrix;
  inverse(): ImmutableMatrix;
  map(fn: (element: number, index: number, matrix: ImmutableMatrix) => number, thisArg: object): ImmutableMatrix;
}

declare class MutableMatrix {
  static identity(size: number, TypedArrayClass: TypedArray): MutableMatrix;
  static fromArray(array: number[], rows: number, cols: number, TypedArrayClass: TypedArray): MutableMatrix;
  static fromNestedArray(matrix: MutableMatrix, TypedArrayClass: TypedArray): MutableMatrix;
  static fromSize(rows: number, cols: number, TypedArrayClass: TypedArray): MutableMatrix;
  static fromTypedArray(typed: TypedArray, rows: number, cols: number): MutableMatrix;
  static fromMatrix(matrix: MutableMatrix): MutableMatrix;
  static validForSum(matrix1: MutableMatrix, matrix2: MutableMatrix): boolean;
  constructor(typedMatrix: TypedArray, rows: number, cols: number, matrixConstructor: TypedArray);
  get(row: number, col: number): number;
  set(row: number, col: number, value: number): void;
  get rows(): number;
  get cols(): number;
  get matrixConstructor(): TypedArray;
  static sum(matrix1: MutableMatrix, matrix2: MutableMatrix): MutableMatrix;
  static subtract(matrix1: MutableMatrix, matrix2: MutableMatrix): MutableMatrix;
  mulOnNumber(x: number): MutableMatrix;
  static mul(matrix1: MutableMatrix, matrix2: MutableMatrix): MutableMatrix;
  mulOnVector(vector: any): MutableMatrix;
  pow(n: number): MutableMatrix;
  static compose(matrix1: MutableMatrix, matrix2: MutableMatrix): MutableMatrix;
  booleanProjecion(): MutableMatrix;
  toUpperTriangle(): MutableMatrix;
  determinant(): number;
  rank(): number;
  tranpose(): MutableMatrix;
  minor(row: number, col: number): number;
  adjugate(): MutableMatrix;
  inverse(): MutableMatrix;
  map(fn: (element: number, index: number, matrix: MutableMatrix) => number, thisArg: object): MutableMatrix;
}

export {
  ImmutableMatrix,
  MutableMatrix,
  ImmutableMatrix as immutable,
  MutableMatrix as mutable,
};
