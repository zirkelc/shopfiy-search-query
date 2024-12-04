# Shopify Search Query Builder

This library provides a search query builder for [Shopify's API search syntax](https://shopify.dev/docs/api/usage/search-syntax).
It provides functions to programmatically build complex search queries with [connectives](https://shopify.dev/docs/api/usage/search-syntax#connectives), [comparators](https://shopify.dev/docs/api/usage/search-syntax#comparators), and [modifiers](https://shopify.dev/docs/api/usage/search-syntax#modifiers).

> [!IMPORTANT]
> This library has been tested on the official examples from the Shopify documentation.
> If you use complex search queries, please verify if the built search query is correct.
>
> If you find any issues, please open an [issue](https://github.com/Shopify/shopify-search-query-builder/issues) or submit a [pull request](https://github.com/Shopify/shopify-search-query-builder/pulls).

## Install

```bash
npm install shopify-search-query
```

## Examples

The following examples are taken from the [Shopify documentation](https://shopify.dev/docs/api/usage/search-syntax#search-query-syntax).

```typescript
import { buildSearchQuery, eq, and, or, not, gt, lte, prefix, exists } from 'shopify-search-query';

/* Field search */
buildSearchQuery(eq('first_name', 'Bob')); // first_name:Bob
buildSearchQuery(and(eq('first_name', 'Bob'), eq('age', '27'))); // first_name:Bob AND age:27

/* Default search */
buildSearchQuery(eq('Bob')); // Bob
buildSearchQuery(and(eq('Bob'), eq('Norman'))); // Bob AND Norman

/* Range search */
buildSearchQuery(gt('orders_count', '16')); // orders_count:>16
buildSearchQuery(and(gt('orders_count', '16'), lte('orders_count', '30'))); // orders_count:>16 AND orders_count:<=30

/* NOT query */
buildSearchQuery(not(eq('Bob'))); // NOT Bob
buildSearchQuery(not(eq('first_name', 'Bob'))); // NOT first_name:Bob

/* Boolean operators */
buildSearchQuery(and(or(eq('bob'), eq('norman')), eq('Shopify'))); // bob OR norman AND Shopify

/* Grouping */
buildSearchQuery(and(eq('state', 'disabled'), or([eq('sale shopper'), eq('VIP')]))); // state:disabled AND ("sale shopper" OR VIP)

/* Phrase query */
buildSearchQuery(eq('first_name', 'Bob Norman')); // first_name:"Bob Norman"

/* Prefix query */
buildSearchQuery(prefix('norm')); // norm*

/* Exists query */
buildSearchQuery(exists('published_at')); // published_at:*
```

More examples can be found in the [tests](./test/builder.test.ts).

## Usage

The library provides exports for the [comparators](./src/comparators.ts), [connectives](./src/connectives.ts), and [modifiers](./src/modifiers.ts).

### Comparators
Shopify supports the following comparators:

- `:`   equality
- `<`   less-than
- `>`   greater-than
- `<=`  less-than-or-equal-to
- `>=`  greater-than-or-equal-to


```typescript
import { eq, gt, gte, lte, lt } from 'shopify-search-query';

buildSearchQuery(eq('first_name', 'Bob')); // first_name:Bob
buildSearchQuery(gt('orders_count', '16')); // orders_count:>16
buildSearchQuery(gte('orders_count', '16')); // orders_count:>=16
buildSearchQuery(lt('orders_count', '30')); // orders_count:<30
buildSearchQuery(lte('orders_count', '30')); // orders_count:<=30 
```

If the exported functions collide with your codebase, you can use the sub-exports from `shopify-search-query/comparators`.

```typescript
import * as comparators from 'shopify-search-query/comparators';

buildSearchQuery(comparators.eq('first_name', 'Bob')); // first_name:Bob
```

### Connectives

Shopify supports the following connectives:

- `AND`
- `OR`

Shopify supports a whitespace between two terms as an implicit `AND` connective. For better readability, this library always uses the explicit `AND` connective.

```typescript
import { and, or } from 'shopify-search-query';

buildSearchQuery(and(eq('first_name', 'Bob'), eq('age', '27'))); // first_name:Bob AND age:27
buildSearchQuery(or(eq('first_name', 'Bob'), eq('age', '27'))); // first_name:Bob OR age:27
```

If the exported functions collide with your codebase, you can use the sub-exports from `shopify-search-query/connectives`.

```typescript
import * as connectives from 'shopify-search-query/connectives';

buildSearchQuery(connectives.and(eq('first_name', 'Bob'), eq('age', '27'))); // first_name:Bob AND age:27
```

### Modifiers

Shopify supports the following modifiers:

- `NOT`   negation

Shopify supports the alternative syntax `-` for negation. For better readability, this library always uses the explicit `NOT` syntax for negation.


```typescript
import { not } from 'shopify-search-query';

buildSearchQuery(not(eq('Bob'))); // NOT Bob
buildSearchQuery(not(eq('first_name', 'Bob'))); // NOT first_name:Bob
```

If the exported functions collide with your codebase, you can use the sub-exports from `shopify-search-query/modifiers`.

```typescript
import * as modifiers from 'shopify-search-query/modifiers';

buildSearchQuery(modifiers.not(eq('Bob'))); // NOT Bob
```

### Default search

The equality comparator (`eq`) can be used without a field to perform a default search.

```typescript
buildSearchQuery(eq('Bob')); // Bob
```

### Grouping

Square brackets are used to group multiple clauses to form subqueries. The terms inside the square brackets will be surrounded with parentheses.

```typescript
// (title:"Caramel Apple") OR (inventory_total:>500 AND inventory_total:<=1000)
buildSearchQuery(
  or(
    [eq('title', 'Caramel Apple')], 
    and(
      [gt('inventory_total', '500'), lte('inventory_total', '1000')]
    )
  ),
]);
```

### Phrase query

A whitespace is interpreted by Shopify as an `AND` connective, therefore values with whitespaces will always be surrounded by double quotes.

```typescript
buildSearchQuery(eq('first_name', 'Bob Norman')); // first_name:"Bob Norman"
```

### Special characters

Special characters like `: \ ( )` in values will be escaped with a backslash.

```typescript
buildSearchQuery(eq('first_name', 'Bob:Norman')); // first_name:Bob\:Norman
```

Date values will be surrounded by double quotes.

```typescript
buildSearchQuery(gt('created_at', '2020-10-21')); // created_at:>"2020-10-21"
buildSearchQuery(gt('created_at', '2020-10-21T23:39:20Z')); // created_at:>"2020-10-21T23:39:20Z"
```
