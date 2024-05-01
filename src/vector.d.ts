
import { TypedArray } from './types';

declare class ImmutableVector {
  static fromArray(array: TypedArray, Constructor: TypedArray): ImmutableVector;
  static fromSize(length: number, Constructor: TypedArray): ImmutableVector;
  static fromVertex(vector: ImmutableVector): ImmutableVector;
  constructor(typed: TypedArray, vectorConstructor: TypedArray);
  get(i: number): number;
  set(i: number, value: number): void;
  get size(): number;
  get VectorConstructor(): TypedArray;
  length(): number;
  dotProduct(vector: ImmutableVector): ImmutableVector;
  mulOnNumber(x: number): ImmutableVector;
  static sum(vector1: ImmutableVector, vector2: ImmutableVector): ImmutableVector;
  static subtract(vector1: ImmutableVector, vector2: ImmutableVector): ImmutableVector;
  normalize(): ImmutableVector;
  isOrthogonalTo(vector: ImmutableVector): boolean;
  isParallelTo(vector: ImmutableVector): boolean;
  static mixedProduct(...vectors: ImmutableVector[]): number;
  angleBetweenVectors(vector: ImmutableVector): number;
  static crossProduct(...vectors: ImmutableVector[]): ImmutableVector;
  map(fn: (element: number, index: number, vector: ImmutableVector) => number, thisArg: object): ImmutableVector;
}

declare class MutableVector {
  static fromArray(array: TypedArray, Constructor: TypedArray): MutableVector;
  static fromSize(length: number, Constructor: TypedArray): MutableVector;
  static fromVertex(vector: MutableVector): MutableVector;
  constructor(typed: TypedArray, vectorConstructor: TypedArray);
  get(i: number): number;
  set(i: number, value: number): void;
  get size(): number;
  get VectorConstructor(): TypedArray;
  length(): number;
  dotProduct(vector: MutableVector): MutableVector;
  mulOnNumber(x: number): MutableVector;
  static sum(vector1: MutableVector, vector2: MutableVector): MutableVector;
  static subtract(vector1: MutableVector, vector2: MutableVector): MutableVector;
  normalize(): MutableVector;
  isOrthogonalTo(vector: MutableVector): boolean;
  isParallelTo(vector: MutableVector): boolean;
  static mixedProduct(...vectors: MutableVector[]): number;
  angleBetweenVectors(vector: MutableVector): number;
  static crossProduct(...vectors: MutableVector[]): MutableVector;
  map(fn: (element: number, index: number, vector: MutableVector) => number, thisArg: object): MutableVector;
}

export {
  ImmutableVector,
  MutableVector,
  ImmutableVector as immutable,
  MutableVector as mutable,
}
