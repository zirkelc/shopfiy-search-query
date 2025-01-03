import type { Query, Term } from './types.js';

/**
 * Regex for matching dates in these format:
 * - YYYY-MM-DD
 * - YYYY-MM-DDThh:mm:ssZ
 * - YYYY-MM-DDThh:mm:ss.sssZ
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/;

/**
 * Regex for matching special characters that need to be escaped:
 * - :
 * - \
 * - (
 * - )
 */
const ESCAPE_REGEX = /([:\\()])/g;

/**
 * Escapes special characters in field names.
 * Names can include the characters -, ', and " but can't start with them.
 */
function escapeName(value: string): string {
  return value.replace(ESCAPE_REGEX, '\\$1');
}

/**
 * Escapes special characters in values.
 * Values need all special characters escaped with backslash.
 * Dates in YYYY-MM-DD or YYYY-MM-DDThh:mm:ssZ format are quoted.
 */
function escapeValue(value: string): string {
  // Check for date formats: YYYY-MM-DD or YYYY-MM-DDThh:mm:ssZ
  const isDate = DATE_REGEX.test(value);
  const hasWhitespace = value.includes(' ');

  if (isDate || hasWhitespace) {
    return `"${value}"`;
  }

  return value.replace(ESCAPE_REGEX, '\\$1');
}

/**
 * Build a search query following the Shopify API search syntax.
 *
 * @see https://shopify.dev/docs/api/usage/search-syntax
 */
function formatTerm(term: Term): string {
  const termString = term.field
    ? `${escapeName(term.field)}${term.comparator}${escapeValue(term.value)}`
    : escapeValue(term.value);

  return term.modifier ? `${term.modifier} ${termString}` : termString;
}

/**
 * Build a search query following the Shopify API search syntax.
 *
 * @see https://shopify.dev/docs/api/usage/search-syntax
 *
 * @example
 * buildSearchQuery(eq('first_name', 'Bob')) // first_name:Bob
 * buildSearchQuery(and(eq('first_name', 'Bob'), eq('orders_count', '16'))) // first_name:Bob AND orders_count:16
 * buildSearchQuery(or(eq('first_name', 'Bob'), eq('orders_count', '16'))) // first_name:Bob OR orders_count:16
 */
export function buildSearchQuery(query: Query | Term): string {
  if ('field' in query) {
    return formatTerm(query);
  }

  const buildTerms = (
    terms: Array<Array<Term | Query> | Term | Query>,
    connective: string,
  ): string => {
    return terms
      .map((term) => {
        if (Array.isArray(term)) {
          return `(${buildTerms(term, connective)})`;
        }
        if ('field' in term) {
          return formatTerm(term);
        }
        return buildSearchQuery(term);
      })
      .join(` ${connective} `);
  };

  const { terms, connective } = query;
  return buildTerms(terms, connective);
}
