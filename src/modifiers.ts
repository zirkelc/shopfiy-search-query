import type { Term } from './types.js';

export type Modifier = (typeof Modifiers)[keyof typeof Modifiers];
export const Modifiers = {
  NOT: 'NOT',
} as const;

/**
 * NOT modifier
 *
 * @example
 * not(eq('Bob')) // NOT Bob
 * not(eq('first_name', 'Bob')) // NOT first_name:Bob
 */
export function not(term: Term): Term {
  return { ...term, modifier: Modifiers.NOT };
}
