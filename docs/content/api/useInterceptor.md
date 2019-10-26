---
title: "useInterceptor"
weight: 7
date: 2019-10-26T11:32:24-07:00
---

This hook causes a confirmation to block navigation.

## API

{{< highlight typescript >}}
export function useInterceptor(
  predicate = true,
  prompt?: string
): void
{{< /highlight >}}

## Basic


If `predicate` is truthy the user will be prompted if they try to navigate away from the page, either by leaving the site or through `<Link>` or `navigate` being invoked.

A standard `prompt` will be used if none is provided. **Note**: due to browser restrictions custom prompts are ignored when the user is trying to leave the site. Custom prompts will always work for in-site navigation from `<Link>` or `navigate` being invoked

{{< highlight jsx >}}
import React, { useState } from 'react'
import { useInterceptor, navigate } from 'raviger'

function Form({ isFormDirty }) {
  // When isFormDirty navigation will cause a confirm dialog
  useInterceptor(isFormDirty)
  return (/* */)
{{< /highlight >}}

