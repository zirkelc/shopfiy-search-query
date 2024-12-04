import { describe, expect, test } from 'vitest';
import { buildSearchQuery } from '../src/builder.js';
import { eq, exists, gt, lte, prefix } from '../src/comparators.js';
import { and, or } from '../src/connectives.js';
import { not } from '../src/modifiers.js';

describe('buildSearchQuery', () => {
  test('field search', () => {
    expect(buildSearchQuery(eq('first_name', 'Bob'))).toBe('first_name:Bob');
    expect(
      buildSearchQuery(and(eq('first_name', 'Bob'), eq('age', '27'))),
    ).toBe('first_name:Bob AND age:27');
    expect(buildSearchQuery(eq('title', 'Caramel Apple'))).toBe(
      'title:"Caramel Apple"',
    );
  });

  test('default search', () => {
    expect(buildSearchQuery(eq('Bob'))).toBe('Bob');
    expect(buildSearchQuery(and(eq('Bob'), eq('Norman')))).toBe(
      'Bob AND Norman',
    );
    expect(buildSearchQuery(and(eq('title', 'Bob'), eq('Norman')))).toBe(
      'title:Bob AND Norman',
    );
  });

  test('range search', () => {
    expect(buildSearchQuery(gt('created_at', '2020-10-21'))).toBe(
      'created_at:>"2020-10-21"',
    );
    expect(buildSearchQuery(gt('created_at', '2020-10-21T23:39:20Z'))).toBe(
      'created_at:>"2020-10-21T23:39:20Z"',
    );
    expect(
      buildSearchQuery(
        and(gt('orders_count', '16'), lte('orders_count', '30')),
      ),
    ).toBe('orders_count:>16 AND orders_count:<=30');
    expect(
      buildSearchQuery(
        or(
          [eq('title', 'Caramel Apple')],
          and([gt('inventory_total', '500'), lte('inventory_total', '1000')]),
        ),
      ),
    ).toBe(
      '(title:"Caramel Apple") OR (inventory_total:>500 AND inventory_total:<=1000)',
    );
  });

  test('not query', () => {
    expect(buildSearchQuery(not(eq('Bob')))).toBe('NOT Bob');
    expect(buildSearchQuery(not(eq('first_name', 'Bob')))).toBe(
      'NOT first_name:Bob',
    );
  });

  test('boolean operators', () => {
    expect(
      buildSearchQuery(and(or(eq('bob'), eq('norman')), eq('Shopify'))),
    ).toBe('bob OR norman AND Shopify');
  });

  test('grouping', () => {
    expect(buildSearchQuery(and(eq('Bob'), eq('Norman')))).toBe(
      'Bob AND Norman',
    );
    expect(buildSearchQuery(and([eq('Bob'), eq('Norman')]))).toBe(
      '(Bob AND Norman)',
    );
    expect(
      buildSearchQuery(or(and([eq('Bob'), eq('Norman')]), eq('Alice'))),
    ).toBe('(Bob AND Norman) OR Alice');
    expect(
      buildSearchQuery(
        and(eq('state', 'disabled'), or([eq('sale shopper'), eq('VIP')])),
      ),
    ).toBe('state:disabled AND ("sale shopper" OR VIP)');
  });

  test('phrase query', () => {
    expect(buildSearchQuery(eq('first_name', 'Bob Norman'))).toBe(
      'first_name:"Bob Norman"',
    );
  });

  test('prefix query', () => {
    expect(buildSearchQuery(prefix('norm'))).toBe('norm*');
    expect(buildSearchQuery(prefix('title', 'head'))).toBe('title:head*');
  });

  test('exists query', () => {
    expect(buildSearchQuery(exists('published_at'))).toBe('published_at:*');
  });

  test('special characters', () => {
    expect(buildSearchQuery(eq('first_name', 'Bob:Norman'))).toBe(
      'first_name:Bob\\:Norman',
    );
    expect(buildSearchQuery(gt('created_at', '2020-10-21'))).toBe(
      'created_at:>"2020-10-21"',
    );
    expect(buildSearchQuery(gt('created_at', '2020-10-21T23:39:20Z'))).toBe(
      'created_at:>"2020-10-21T23:39:20Z"',
    );
  });
});
