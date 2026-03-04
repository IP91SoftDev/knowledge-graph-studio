# Hard Constraints System

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Compliance:** MANDATORY

---

## Overview

These are non-negotiable design constraints. Violation = automatic rejection. No exceptions.

**Principle:** Constraints enable creativity. Chaos kills it.

---

## Constraint 1: Depth Layer Rules

### 4-Level Elevation System (ONLY)

| Level | Name | Background | Border | Shadow | Z-Index | Usage |
|-------|------|------------|--------|--------|---------|-------|
| 0 | Page Background | `bg-background` | none | none | 0 | Base page surface |
| 1 | Section Surface | `bg-card` | `border-border/50` | `shadow-sm` | 10 | Sections, content areas |
| 2 | Card Surface | `bg-card` | `border-border` | `shadow-md` | 20 | Cards, panels, widgets |
| 3 | Hover/Active | `bg-accent` | `border-border` | `shadow-lg` | 30 | Hover states, active elements |

### Forbidden
- ❌ Level 4+ elevations (no floating modals above z-30)
- ❌ Custom shadow values (must use token system)
- ❌ Border opacity outside defined values
- ❌ Z-index values not in system (10, 20, 30 only)

### Component Mapping

| Component | Depth Level | Token |
|-----------|-------------|-------|
| Page | 0 | `bg-background` |
| Section | 1 | `border-border/50 shadow-sm` |
| Card | 2 | `border-border shadow-md` |
| Card Hover | 3 | `shadow-lg` |
| Modal | 3 | `shadow-lg z-30` |
| Dropdown | 3 | `shadow-lg z-30` |

### Enforcement Rule
> If a component does not fit one of these 4 levels → **REJECT**

---

## Constraint 2: Spacing Tier Enforcement

### Strict Spacing Scale

| Token | Value (px) | Value (rem) | Name | Usage |
|-------|------------|-------------|------|-------|
| `space-xs` | 4 | 0.25rem | xs | Tight gaps, icon spacing |
| `space-sm` | 8 | 0.5rem | sm | Internal component padding |
| `space-md` | 16 | 1rem | md | Standard padding, card gaps |
| `space-lg` | 24 | 1.5rem | lg | Section padding |
| `space-xl` | 32 | 2rem | xl | Section-to-section |
| `space-2xl` | 48 | 3rem | 2xl | Large section gaps |
| `space-3xl` | 64 | 4rem | 3xl | Page-level spacing |

### Mandatory Rules

| Element | Required Spacing | Violation |
|---------|-----------------|-----------|
| Section-to-section | `xl` (32px) or `2xl` (48px) | ❌ Reject if other |
| Card padding | `md` (16px) or `lg` (24px) | ❌ Reject if other |
| Button internal | `sm` (8px) or `md` (16px) | ❌ Reject if other |
| Grid gaps | `md` (16px) or `lg` (24px) | ❌ Reject if other |
| Form field gaps | `sm` (8px) or `md` (16px) | ❌ Reject if other |

### Forbidden
- ❌ Arbitrary values: `p-[13px]`, `m-[17px]`, `gap-[5px]`
- ❌ Inline spacing: `style={{ padding: '15px' }}`
- ❌ Non-scale values: `p-5` (20px not in scale)

### Enforcement Rule
> If spacing does not match scale → **REJECT**

---

## Constraint 3: Accent Saturation Limits

### Single Accent Rule

**Max 1 primary accent color per project.**

| Project | Accent Color | Token |
|---------|--------------|-------|
| KGS | Indigo | `text-primary`, `bg-primary` |

### Accent Usage (ONLY)

| Use Case | Allowed | Example |
|----------|---------|---------|
| Primary actions | ✅ | Primary buttons |
| Highlights | ✅ | Active states, selected items |
| Status indicators | ✅ | Success/warning/error (functional colors) |
| Links | ✅ | Interactive text |

### Forbidden Accent Usage
- ❌ Secondary buttons (use `secondary` variant)
- ❌ Decorative elements
- ❌ Backgrounds (except hover)
- ❌ Icons (except interactive)
- ❌ Borders (except focus rings)

### 10% Viewport Rule

**Accent must not exceed 10% of total viewport area.**

**Calculation:**
```
Accent Area = Σ(all accent-colored elements visible)
Viewport Area = window.innerWidth × window.innerHeight
Accent Ratio = (Accent Area / Viewport Area) × 100

Must be: ≤ 10%
```

**Visual Check:**
- ✅ Accent draws eye to important actions
- ❌ Accent overwhelms with color

### No Rainbow UI Rule

**Status colors are FUNCTIONAL, not decorative:**

| Color | Use Only For |
|-------|--------------|
| Green/Emerald | Success states, approved |
| Amber/Yellow | Warning states, pending |
| Red | Error states, destructive |
| Blue | Info states, links |

**Forbidden:**
- ❌ Purple, pink, cyan for decoration
- ❌ Multi-color badges without meaning
- ❌ Rainbow loading states

### No Emoji in SaaS Mode

**For enterprise/SaaS interfaces:**
- ❌ No emoji in buttons
- ❌ No emoji in navigation
- ❌ No emoji in data tables
- ❌ No emoji in status indicators

**Exception:**
- ✅ Empty state illustrations (sparingly)
- ✅ Marketing/landing pages (brand-appropriate)

### Enforcement Rule
> If accent exceeds limits or rainbow UI detected → **REJECT**

---

## Constraint 4: Motion Duration System

### Motion Tiers (ONLY)

| Tier | Duration | Easing | Usage |
|------|----------|--------|-------|
| Fast | 120ms | `ease-out` | Hover states, micro-interactions |
| Normal | 180ms | `ease-out` | Expand/collapse, sidebar toggle |
| Smooth | 240ms | `ease-in-out` | Page transitions, modals |

### Mandatory Rules

| Interaction | Duration | Violation |
|-------------|----------|-----------|
| Hover | 120ms | ❌ Reject if other |
| Button press | 120ms | ❌ Reject if other |
| Sidebar collapse | 180ms | ❌ Reject if other |
| Dropdown open | 180ms | ❌ Reject if other |
| Modal fade | 240ms | ❌ Reject if other |
| Page transition | 240ms | ❌ Reject if other |

### Forbidden
- ❌ Any animation > 300ms (feels sluggish)
- ❌ Any animation < 100ms (feels jarring)
- ❌ Spring animations (non-linear chaos)
- ❌ Inconsistent timing (120ms here, 150ms there)
- ❌ `transition-all` without duration specification

### Implementation

```tsx
// ✅ Correct
className="transition-shadow duration-120 hover:shadow-lg"

// ❌ Wrong
className="transition-all hover:shadow-lg" // No duration

// ❌ Wrong
className="transition duration-[150ms]" // Arbitrary value

// ❌ Wrong
style={{ transition: 'all 0.3s cubic-bezier(...)' }} // Spring chaos
```

### Framer Motion Config

```ts
// framer-motion.config.ts
export const motionConfig = {
  fast: { duration: 0.12, ease: 'easeOut' },
  normal: { duration: 0.18, ease: 'easeOut' },
  smooth: { duration: 0.24, ease: 'easeInOut' },
}
```

### Enforcement Rule
> If animation > 300ms or spring chaos detected → **REJECT**

---

## Constraint Validation Checklist

Before any UI review, verify:

### Depth
- [ ] Component fits one of 4 depth levels
- [ ] Correct background token used
- [ ] Correct border opacity
- [ ] Correct shadow tier
- [ ] Z-index in system (0, 10, 20, 30)

### Spacing
- [ ] All values from spacing scale
- [ ] No arbitrary values (`p-[13px]`)
- [ ] Section spacing ≥ xl (32px)
- [ ] Card padding = md or lg
- [ ] Button padding = sm or md

### Accent
- [ ] Single accent color used
- [ ] Accent ≤ 10% of viewport
- [ ] No rainbow UI
- [ ] No emoji in SaaS mode
- [ ] Status colors functional only

### Motion
- [ ] Duration from tiers (120/180/240ms)
- [ ] No animation > 300ms
- [ ] No spring animations
- [ ] Consistent timing throughout

---

## Violation Consequences

| Violation | First | Second | Third |
|-----------|-------|--------|-------|
| Depth layer | Fix required | PR blocked | Design review |
| Spacing tier | Fix required | PR blocked | Team warning |
| Accent limit | Fix required | PR blocked | Redesign |
| Motion duration | Fix required | PR blocked | Remove animation |

---

## Reference Implementation

### Correct Card Component

```tsx
<Card className="
  bg-card           /* Level 2 */
  border-border     /* Correct border */
  shadow-md         /* Correct shadow */
  transition-shadow /* Motion defined */
  duration-120      /* Fast tier */
  hover:shadow-lg   /* Level 3 on hover */
">
  <CardHeader className="pb-4">  {/* md spacing */}
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="pt-4"> {/* md spacing */}
    Content
  </CardContent>
</Card>
```

### Incorrect Card Component (REJECTED)

```tsx
<Card className="
  bg-white          /* Hardcoded color */
  border-gray-200   /* Hardcoded border */
  shadow-xl         /* Wrong shadow (Level 4+) */
  transition-all    /* No duration */
  hover:shadow-2xl  /* Wrong shadow */
  style={{ padding: '18px' }} /* Arbitrary spacing */
">
  🎉 Card Title  {/* Emoji in SaaS */}
  <Button className="bg-purple-500"> {/* Wrong accent */}
    Click me
  </Button>
</Card>
```

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
