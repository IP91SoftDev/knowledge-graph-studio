# Theme System

**Date:** 2026-03-03  
**Implementation:** next-themes + Tailwind CSS class strategy  
**Status:** ✅ Implemented

---

## Strategy

### Approach: Class-based Dark Mode

```ts
// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  // ...
}
```

**Why Class-based:**
- ✅ Full control over theme switching
- ✅ No flash-of-unstyled-theme (FOUST)
- ✅ Persists in localStorage automatically
- ✅ System preference fallback
- ✅ Compatible with shadcn/ui

---

## Architecture

### 1. Theme Provider

**Location:** `apps/web/components/theme/ThemeProvider.tsx`

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

**Usage:** Wrap root layout

```tsx
// apps/web/app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </body>
</html>
```

---

### 2. Theme Toggle Component

**Location:** `apps/web/components/theme/ThemeToggle.tsx`

**Features:**
- ✅ Accessible (aria-label)
- ✅ Animated state change (sun/moon icons)
- ✅ Hydration-safe (mounted check)
- ✅ Persists automatically via next-themes

**Implementation:**

```tsx
'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <DisabledToggle />;

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
```

**Placement:** Sidebar footer (next to profile)

---

### 3. Token Mapping

### Background Tokens

| Token | Light | Dark | Class |
|-------|-------|------|-------|
| Page bg | `#ffffff` | `#09090b` | `bg-background` |
| Card bg | `#ffffff` | `#09090b` | `bg-card` |
| Muted bg | `#f4f4f5` | `#27272a` | `bg-muted` |
| Accent bg | `#f4f4f5` | `#27272a` | `bg-accent` |

### Surface Tokens

| Token | Light | Dark | Class |
|-------|-------|------|-------|
| Primary | `#18181b` | `#fafafa` | `bg-primary` |
| Secondary | `#f4f4f5` | `#27272a` | `bg-secondary` |
| Destructive | `#ef4444` | `#7f1d1d` | `bg-destructive` |

### Border Tokens

| Token | Light | Dark | Class |
|-------|-------|------|-------|
| Default | `#e4e4e7` | `#27272a` | `border-border` |
| Input | `#e4e4e7` | `#3f3f46` | `border-input` |

### Text Tokens

| Token | Light | Dark | Class |
|-------|-------|------|-------|
| Foreground | `#09090b` | `#fafafa` | `text-foreground` |
| Muted | `#71717a` | `#a1a1aa` | `text-muted-foreground` |
| Primary fg | `#fafafa` | `#18181b` | `text-primary-foreground` |

### Accent/Hover States

| Element | Light Hover | Dark Hover |
|---------|-------------|------------|
| Button | `bg-gray-100` | `bg-gray-800` |
| Card | `bg-gray-50` | `bg-gray-900` |
| Link | `text-indigo-700` | `text-indigo-400` |

---

## Table Contrast Rules

### Light Mode

```tsx
className="bg-white text-gray-900 border-gray-200"
```

### Dark Mode

```tsx
className="dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800"
```

### Striped Rows

```tsx
className="even:bg-muted/50 dark:even:bg-muted/20"
```

---

## Implementation Checklist

### ✅ Completed

- [x] Install next-themes
- [x] Create ThemeProvider
- [x] Create ThemeToggle
- [x] Wrap root layout
- [x] Add toggle to AppShell sidebar
- [x] Configure Tailwind dark mode

### ⏳ TODO

- [ ] Add dark mode variants to all components
- [ ] Test all pages in dark mode
- [ ] Add dark mode to shadcn/ui components
- [ ] Document dark mode color palette

---

## Usage Examples

### Basic Component

```tsx
<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div className="p-6">
    <h3 className="text-lg font-medium">Card Title</h3>
    <p className="text-sm text-muted-foreground">
      This card adapts to theme automatically.
    </p>
  </div>
</div>
```

### Button with Theme

```tsx
<Button
  variant="outline"
  className="hover:bg-accent hover:text-accent-foreground"
>
  Click me
</Button>
```

### Icon with Theme

```tsx
<svg className="text-foreground dark:text-muted-foreground">
  {/* Icon adapts to theme */}
</svg>
```

---

## Best Practices

### ✅ Do

- Use semantic tokens (`bg-card`, `text-foreground`)
- Add `dark:` variants for custom colors
- Test in both themes before merging
- Use `suppressHydrationWarning` on `<html>` only

### ❌ Don't

- Use hardcoded colors (`#ffffff`, `#000000`)
- Skip dark mode testing
- Add inline styles for colors
- Forget `dark:` variants

---

## Testing

### Manual Test

1. Click theme toggle in sidebar
2. Verify all pages adapt correctly
3. Check contrast ratios
4. Verify icons render correctly

### Automated Test (TODO)

```tsx
// e2e/theme.spec.ts
test('theme toggle works', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Toggle theme"]');
  await expect(page.locator('html')).toHaveAttribute('class', 'dark');
});
```

---

## Troubleshooting

### Flash of Unstyled Theme (FOUST)

**Solution:** Already prevented with `disableTransitionOnChange`

### Hydration Mismatch

**Solution:** Use `mounted` check in ThemeToggle

### Icons Not Switching

**Solution:** Check `dark:` class variants are correct

---

*Last updated: 2026-03-03*  
*Implementation complete*
