---
title: "useNavigationPrompt"
permalink: /use-navigation-prompt/
nav_order: 58
---

# `useNavigationPrompt`

This hook causes a confirmation to block navigation.

## API

```typescript
export function useNavigationPrompt(
  predicate = true,
  prompt?: string
): void
```

## Basic


If `predicate` is truthy the user will be prompted if they try to navigate away from the page, either by leaving the site or through `<Link>` or `navigate` being invoked.

A standard `prompt` will be used if none is provided. **Note**: due to browser restrictions custom prompts are ignored when the user is trying to leave the site. Custom prompts will always work for in-site navigation from `<Link>` or `navigate` being invoked

```jsx
import React, { useState } from 'react'
import { useNavigationPrompt, navigate } from 'raviger'

function Form({ isFormDirty }) {
  // When isFormDirty navigation will cause a confirm dialog
  useNavigationPrompt(isFormDirty)
  return (/* */)
```

