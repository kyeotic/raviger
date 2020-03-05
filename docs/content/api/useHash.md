---
title: "useHash"
date: 2020-03-04T20:17:16-08:00
weight: 9
---

A hook for getting the current hash of the page. Will cause re-renders when the hash changes.

## API

{{< highlight typescript >}}
export function useHash(options?: { stripHash?: boolean }): string
{{< /highlight >}}

## stripHash

If `options.stripHash` is `true` the hash will be returned without the literal "#" at the beginning. If you need the "#" set `options.stripHash` to `false`. `default = true`