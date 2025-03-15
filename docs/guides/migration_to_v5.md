---
title: "Migration Guide - v5"
permalink: /migraiton-to-v5/
nav_order: 98
---

# v5 Migration Guide

Raviger v5 comes with just one breaking change to the API.

- **BREAKING**: changed parameters on `useQueryParams` setter options from `replace, replaceHistory` to `overwrite, replace` to keep consistency with `replace` on other navigation functions.

## useQueryParams setter

Originally `useQueryParams` had an options object that allowed it to control whether the querystring was merged with the setter values or replaced by them. The options object used the `replace` key for this behavior.

However, `useNavigate` used `replace` to control whether `history.replaceState` or `history.pushState` was used. When `useQueryParams` was extended to support this `history.replaceState` behavior, the natural name "replace" was already taken, so `replaceHistory` was used as a temporary measure.

Since the `replace` used by `useNavigate` is a natural name, `useQueryParams` is taking the breaking change to align with this. The setter's options `replace` has been renamed to `overwrite` `replaceHistory` has been renamed to `replace`.

```typescript
export interface setQueryParamsOptions {
  /**
   * Controls whether the querystring is overwritten or merged into
   *
   * default: true
   */
  overwrite?: boolean
  /**
   * Controls whether the querystring update causes a history push or replace
   *
   * default: false
   */
  replace?: boolean
}

```

### How to fix

Find all the uses of `useQueryParams` where the setter uses a `replace` or `replaceHistory` option.

- Rename `replace` to `overwrite`. Keep the same value.
- Rename `replaceHistory` to `replace`. Keep the same value.