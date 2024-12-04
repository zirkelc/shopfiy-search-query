import type { Term } from './types.js';

export type Comparator = (typeof Comparators)[keyof typeof Comparators];

/**
 * Comparators
 */
export const Comparators = {
  EQ: ':', // equal
  GT: ':>', // greater than
  LT: ':<', // less than
  GTE: ':>=', // greater than or equal to
  LTE: ':<=', // less than or equal to
} as const;

/**
 * Equality comparator
 *
 * @example
 * eq('Bob')                // Bob
 * eq('first_name', 'Bob')  // first_name:Bob
 */
export function eq(value: string): Term;
export function eq(field: string, value: string): Term;
export function eq(fieldOrValue: string, value?: string): Term {
  // default search
  if (value === undefined)
    return { field: '', value: fieldOrValue, comparator: Comparators.EQ };

  // field search
  return { field: fieldOrValue, value, comparator: Comparators.EQ };
}

/**
 * Greater than comparator
 *
 * @example
 * gt('age', '27')  // age:>27
 */
export function gt(field: string, value: string): Term {
  return { field, value, comparator: Comparators.GT };
}

/**
 * Less than comparator
 *
 * @example
 * lt('age', '27')  // age:<27
 */
export function lt(field: string, value: string): Term {
  return { field, value, comparator: Comparators.LT };
}

/**
 * Greater than or equal to comparator
 *
 * @example
 * gte('age', '27')  // age:>=27
 */
export function gte(field: string, value: string): Term {
  return { field, value, comparator: Comparators.GTE };
}

/**
 * Less than or equal to comparator
 *
 * @example
 * lte('age', '27')  // age:<=27
 */
export function lte(field: string, value: string): Term {
  return { field, value, comparator: Comparators.LTE };
}

/**
 * Creates a prefix query that matches terms beginning with the specified characters
 *
 * @example
 * prefix('norm')           // norm*
 * prefix('title', 'head')  // title:head*
 */
export function prefix(value: string): Term;
export function prefix(field: string, value: string): Term;
export function prefix(fieldOrValue: string, value?: string): Term {
  // default search
  if (value === undefined)
    return { field: '', value: `${fieldOrValue}*`, comparator: Comparators.EQ };

  // field search
  return {
    field: fieldOrValue,
    value: `${value}*`,
    comparator: Comparators.EQ,
  };
}

/**
 * Creates an exists query that matches non-null values in the specified field
 *
 * @example
 * exists('published_at') // published_at:*
 */
export function exists(field: string): Term {
  return { field, value: '*', comparator: Comparators.EQ };
}
