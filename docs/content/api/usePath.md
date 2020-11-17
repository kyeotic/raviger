---
title: "usePath"
date: 2019-09-30T18:43:29-07:00
weight: 8
---

Get the current path of the page. If `basePath` is provided and missing from the current path `null` is returned.

## API

{{< highlight typescript >}}
export function usePath(basePath?: string): string
{{< /highlight >}}
