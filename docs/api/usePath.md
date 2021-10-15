---
title: "usePath"
permalink: /use-path/
nav_order: 8
---

# `usePath`

Get the current `decodeURIComponent`-ed path of the page. If `basePath` is provided and missing from the current path `null` is returned.

## API

```typescript
export function usePath(basePath?: string): string
```
