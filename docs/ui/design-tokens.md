# Design Tokens

**Date:** 2026-03-03  
**System:** Tailwind CSS + shadcn/ui  
**Basis:** Square UI alignment analysis

---

## Spacing Scale

**Base:** 4px (0.25rem)

| Token | Value | Class | Use Case |
|-------|-------|-------|----------|
| `space-xs` | 0.25rem (4px) | `gap-1`, `p-1` | Tight spacing, icon gaps |
| `space-sm` | 0.5rem (8px) | `gap-2`, `p-2` | Component internal spacing |
| `space-md` | 1rem (16px) | `gap-4`, `p-4` | Standard padding |
| `space-lg` | 1.5rem (24px) | `gap-6`, `p-6` | Card padding, section spacing |
| `space-xl` | 2rem (32px) | `gap-8`, `p-8` | Large section gaps |
| `space-2xl` | 3rem (48px) | `gap-12` | Page-level spacing |

**Rule:** No inline ad-hoc values. Use scale only.

---

## Radius Scale

| Token | Value | Class | Use Case |
|-------|-------|-------|----------|
| `radius-sm` | 0.25rem (4px) | `rounded-sm` | Small elements, badges |
| `radius-md` | 0.375rem (6px) | `rounded-md` | Buttons, inputs |
| `radius-lg` | 0.5rem (8px) | `rounded-lg` | Cards, containers |
| `radius-xl` | 0.75rem (12px) | `rounded-xl` | Modals, large cards |
| `radius-2xl` | 1rem (16px) | `rounded-2xl` | Feature sections |
| `radius-full` | 9999px | `rounded-full` | Avatars, pills |

---

## Shadow Scale

| Token | Value | Class | Use Case |
|-------|-------|-------|----------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-sm` | Subtle elevation |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.1)` | `shadow` | Cards, buttons |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | `shadow-md` | Dropdowns, modals |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | `shadow-lg` | Floating panels |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | `shadow-xl` | Modal overlays |

---

## Typography Scale

### Font Sizes

| Token | Value | Class | Line Height | Use Case |
|-------|-------|-------|-------------|----------|
| `text-xs` | 0.75rem (12px) | `text-xs` | 1rem | Labels, captions |
| `text-sm` | 0.875rem (14px) | `text-sm` | 1.25rem | Body small, UI text |
| `text-base` | 1rem (16px) | `text-base` | 1.5rem | Body text |
| `text-lg` | 1.125rem (18px) | `text-lg` | 1.75rem | Lead text |
| `text-xl` | 1.25rem (20px) | `text-xl` | 1.75rem | H3 |
| `text-2xl` | 1.5rem (24px) | `text-2xl` | 2rem | H2 |
| `text-3xl` | 1.875rem (30px) | `text-3xl` | 2.25rem | H1 |
| `text-4xl` | 2.25rem (36px) | `text-4xl` | 2.5rem | Display |

### Font Weights

| Token | Value | Class | Use Case |
|-------|-------|-------|----------|
| `font-normal` | 400 | `font-normal` | Body text |
| `font-medium` | 500 | `font-medium` | UI elements, labels |
| `font-semibold` | 600 | `font-semibold` | Subheadings |
| `font-bold` | 700 | `font-bold` | Headings |

---

## Color System

### Semantic Tokens (shadcn/ui CSS variables)

| Token | Light Mode | Dark Mode | Use Case |
|-------|------------|-----------|----------|
| `--background` | `#ffffff` | `#09090b` | Page background |
| `--foreground` | `#09090b` | `#fafafa` | Text color |
| `--card` | `#ffffff` | `#09090b` | Card backgrounds |
| `--card-foreground` | `#09090b` | `#fafafa` | Card text |
| `--border` | `#e4e4e7` | `#27272a` | Borders, dividers |
| `--accent` | `#f4f4f5` | `#27272a` | Hover states |
| `--muted` | `#f4f4f5` | `#27272a` | Secondary text |
| `--primary` | `#18181b` | `#fafafa` | Primary actions |
| `--primary-foreground` | `#fafafa` | `#18181b` | Primary text |

### Status Colors

| Status | Light | Dark | Use Case |
|--------|-------|------|----------|
| Success | `#16a34a` (green-600) | `#22c55e` (green-500) | Success states |
| Warning | `#ca8a04` (yellow-600) | `#eab308` (yellow-500) | Warning states |
| Error | `#dc2626` (red-600) | `#ef4444` (red-500) | Error states |
| Info | `#2563eb` (blue-600) | `#3b82f6` (blue-500) | Info states |

---

## Component Tokens

### Card

```tsx
className="rounded-lg border bg-card text-card-foreground shadow-sm"
```

**Composition:**
- `rounded-lg` — radius-lg
- `border` — 1px solid --border
- `bg-card` — --card
- `shadow-sm` — shadow-sm

### Button

```tsx
className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
```

**Variants:**
- Primary: `bg-primary text-primary-foreground hover:bg-primary/90`
- Secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- Ghost: `hover:bg-accent hover:text-accent-foreground`
- Outline: `border border-input bg-background hover:bg-accent`

### Input

```tsx
className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
```

**Height:** `h-10` (40px)

---

## Density Rules

### Table

| Element | Spacing | Class |
|---------|---------|-------|
| Cell padding | 12px 16px | `px-4 py-3` |
| Row border | 1px | `border-b` |
| Header bg | Muted | `bg-muted/50` |

### Cards

| Element | Spacing | Class |
|---------|---------|-------|
| Card padding | 24px | `p-6` |
| Gap between cards | 16px | `gap-4` |
| KPI grid | 16px | `gap-4` |

---

## Enforcement Rules

### ❌ Not Allowed

```tsx
// ❌ Ad-hoc values
className="p-[13px]"     // Use p-3 (12px) or p-4 (16px)
className="rounded-[7px]" // Use rounded-md (6px) or rounded-lg (8px)
className="text-[15px]"   // Use text-sm (14px) or text-base (16px)
className="gap-[5px]"     // Use gap-1 (4px) or gap-2 (8px)
```

### ✅ Required

```tsx
// ✅ Token-based
className="p-3"
className="rounded-md"
className="text-sm"
className="gap-2"
```

---

## Migration Guide

### From Ad-hoc to Tokens

| Before | After |
|--------|-------|
| `p-[12px]` | `p-3` |
| `m-[20px]` | `m-5` |
| `rounded-[8px]` | `rounded-lg` |
| `text-[14px]` | `text-sm` |
| `gap-[6px]` | `gap-1.5` |

---

## Review Checklist

Before merging UI changes:

- [ ] Uses spacing scale (no ad-hoc px values)
- [ ] Uses radius scale
- [ ] Uses semantic color tokens
- [ ] Dark mode compatible (`dark:` variants)
- [ ] Consistent with token system

---

*Last updated: 2026-03-03*  
*Based on Square UI analysis*
