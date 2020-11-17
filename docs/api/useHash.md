---
title: "useHash"
permalink: /use-hash/
nav_order: 9
---

A hook for getting the current hash of the page. Will cause re-renders when the hash changes.

## API

```typescript
export function useHash(options?: { stripHash?: boolean }): string
```

## stripHash

If `options.stripHash` is `true` the hash will be returned without the literal "#" at the beginning. If you need the "#" set `options.stripHash` to `false`. `default = true`