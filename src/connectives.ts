import type { NonEmptyArray, Query, Term } from './types.js';

export type Connective = (typeof Connectives)[keyof typeof Connectives];

/**
 * Connectives
 */
export const Connectives = {
  AND: 'AND',
  OR: 'OR',
} as const;

/**
 * AND connective
 *
 * @example
 * and(eq('first_name', 'Bob'), eq('orders_count', '16')) // first_name:Bob AND orders_count:16
 */
export function and(
  ...termsOrArray: NonEmptyArray<Array<Term | Query> | Term | Query>
): Query {
  return {
    terms: termsOrArray,
    connective: Connectives.AND,
  };
}

/**
 * OR connective
 *
 * @example
 * or(eq('first_name', 'Bob'), eq('orders_count', '16')) // first_name:Bob OR orders_count:16
 */
export function or(
  ...termsOrArray: NonEmptyArray<Array<Term | Query> | Term | Query>
): Query {
  return {
    terms: termsOrArray,
    connective: Connectives.OR,
  };
}
