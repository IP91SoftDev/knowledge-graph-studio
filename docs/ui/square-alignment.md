# Square UI Alignment Report

**Date:** 2026-03-03  
**Reference:** https://square-ui-marketing-dashboard.vercel.app/  
**Snapshot:** `docs/snapshots/2026-03-03T16-29-46-413Z-f7348fc5/`

---

## Structural Breakdown

### Root Layout Container

```html
<div class="flex min-h-screen">
  <aside class="w-64 border-r bg-white">...</aside>
  <main class="flex-1">...</main>
</div>
```

**Pattern:** Flexbox with fixed sidebar (w-64 = 256px) + flexible main content

### Sidebar Behavior

| Feature | Status | Implementation |
|---------|--------|----------------|
| Fixed width | ✅ | `w-64` (256px) |
| Full height | ✅ | `min-h-screen` |
| Border right | ✅ | `border-r` |
| White background | ✅ | `bg-white` |
| Navigation items | ✅ | Stacked links with icons |
| Brand at top | ✅ | Logo + title |

### Grid System

**KPI Cards Row:**
```html
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <!-- 4 cards -->
</div>
```

**Pattern:** Responsive grid
- Mobile: 1 column
- Tablet: 2 columns  
- Desktop: 4 columns

### Card Component Structure

```html
<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div class="p-6">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium">Title</h3>
      <Icon />
    </div>
    <div class="mt-4">
      <div class="text-2xl font-bold">Value</div>
      <p class="text-xs text-muted">Trend</p>
    </div>
  </div>
</div>
```

**Key Classes:**
- `rounded-lg` — Border radius
- `border` — Subtle border
- `bg-card` — Theme-aware background
- `shadow-sm` — Light shadow
- `p-6` — Padding (24px)

### Table Implementation

| Feature | Class/Pattern |
|---------|---------------|
| Container | `rounded-lg border` |
| Header | `bg-muted/50` |
| Row | `border-b` |
| Cell | `p-4` |
| Density | Compact (py-2, px-3) |

### Theme Toggle Implementation

**Detected Pattern:**
```tsx
<button class="size-9">
  <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</button>
```

**Classes Found:**
- `dark:` prefix for dark mode variants
- `text-emerald-600 dark:text-emerald-400` — Color adjustment
- `bg-white dark:bg-gray-900` — Background swap

### Typography Scale

| Element | Class | Computed |
|---------|-------|----------|
| H1 | `text-2xl font-bold` | 24px, bold |
| H2 | `text-xl font-semibold` | 20px, semibold |
| H3 | `text-lg font-medium` | 18px, medium |
| Body | `text-sm` | 14px |
| Small | `text-xs` | 12px |

### Spacing Rhythm

**Most Common:**
- `p-2` (8px)
- `py-3` (12px)
- `gap-2` (8px)
- `px-3` (12px)
- `p-6` (24px) — Card padding

**Pattern:** Tailwind 4px base scale

---

## Component Mapping

| Square UI Component | shadcn/ui Equivalent | KGS Status |
|---------------------|---------------------|------------|
| Card | `Card` | ✅ Available |
| Button | `Button` | ✅ Available |
| Table | `Table` | ⏳ TODO |
| Badge | `Badge` | ⏳ TODO |
| Input | `Input` | ✅ Available |
| Theme Toggle | Custom | ⏳ TODO |

---

## Token Extraction

### Colors (shadcn/ui CSS variables)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --accent: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --border: 217.2 32.6% 17.5%;
}
```

### Spacing Scale

```
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
```

### Radius Scale

```
sm:   0.25rem (4px)
md:   0.375rem (6px)
lg:   0.5rem (8px)
xl:   0.75rem (12px)
```

---

## Migration Delta

### What Square UI Has

- ✅ Dark mode with class-based toggle
- ✅ shadcn/ui component library
- ✅ Consistent token system
- ✅ Responsive grid layouts
- ✅ Dense table patterns
- ✅ Subtle borders + shadows

### What KGS Lacks

- ❌ Dark mode implementation
- ❌ shadcn/ui components installed
- ❌ Theme toggle component
- ❌ Design token documentation
- ❌ Consistent spacing enforcement
- ⚠️ Table component (basic exists, needs enhancement)

### Priority Actions

1. **Install shadcn/ui** — Foundation for components
2. **Implement dark mode** — next-themes + Tailwind class strategy
3. **Create theme toggle** — Accessible, animated
4. **Document tokens** — Spacing, colors, radius
5. **Enhance tables** — Sorting, filtering, pagination

---

## Implementation Checklist

### Phase A: Foundation
- [ ] Install shadcn/ui
- [ ] Add next-themes
- [ ] Configure Tailwind dark mode (`class`)
- [ ] Create theme provider

### Phase B: Components
- [ ] Install Card, Button, Table, Badge, Input
- [ ] Create ThemeToggle component
- [ ] Update AppShell for dark mode

### Phase C: Dashboard
- [ ] Refactor KPI cards (4-up grid)
- [ ] Update table with filters
- [ ] Add responsive breakpoints

---

*Generated from Square UI snapshot analysis*  
*Snapshot: 2026-03-03T16-29-46-413Z-f7348fc5*
