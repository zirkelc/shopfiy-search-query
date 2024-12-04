import type { Comparator } from './comparators.js';
import type { Connective } from './connectives.js';
import type { Modifier } from './modifiers.js';

export type NonEmptyArray<T> = [T, ...T[]];

export type Term = {
  field: string;
  value: string;
  comparator: Comparator;
  modifier?: Modifier;
};

export type Query = {
  terms: Array<Array<Term | Query> | Term | Query>;
  connective: Connective;
};
