# Motion Framework

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

Motion is not decoration. Motion is communication.

**Principle:** Every animation has a purpose. Purposeless motion is noise.

---

## 1. Motion Purpose Categories

Every animation must fit one of these categories.

| Category | Purpose | Duration | Use Cases |
|----------|---------|----------|-----------|
| Functional | Communicate state change | 120-180ms | Collapse, expand, toggle, slide |
| Feedback | Confirm user action | 100-120ms | Hover, press, focus, select |
| Narrative | Guide through story | 240-400ms | Hero transitions, onboarding |
| Emotional | Evoke feeling | 400ms+ | Wedding intros, brand moments |

### Category Specifications

#### Functional Motion

**Purpose:** Communicate that something changed.

**Examples:**
- Sidebar collapse/expand
- Dropdown open/close
- Modal fade in/out
- Tab switch
- Accordion expand/collapse

**Rules:**
- Duration: 120-180ms (Normal tier)
- Easing: `ease-out` (clear start, soft end)
- Direction: Logical (down opens, up closes)
- No decorative elements

**KGS Usage:** ✅ PRIMARY (dashboard functional UI)

---

#### Feedback Motion

**Purpose:** Confirm user interaction.

**Examples:**
- Button hover (shadow/color shift)
- Button press (scale down slightly)
- Focus ring appearance
- Checkbox toggle
- Toggle switch

**Rules:**
- Duration: 100-120ms (Fast tier)
- Easing: `ease-out` or linear
- Subtle, not distracting
- Instant response feel

**KGS Usage:** ✅ PRIMARY (interactive elements)

---

#### Narrative Motion

**Purpose:** Guide user through a sequence or story.

**Examples:**
- Onboarding flow transitions
- Multi-step form progression
- Hero section scroll reveal
- Page transitions (SPA)

**Rules:**
- Duration: 240-400ms (Smooth tier)
- Easing: `ease-in-out` (smooth start/end)
- Choreographed, not random
- Used sparingly

**KGS Usage:** ⚠️ LIMITED (only for onboarding if added)

---

#### Emotional Motion

**Purpose:** Create memorable, feeling-based experience.

**Examples:**
- Wedding site intro animation
- Brand reveal moments
- Celebration confetti
- Scroll-triggered parallax

**Rules:**
- Duration: 400ms+ (Cinematic)
- Easing: Custom curves
- High production value required
- Never in functional UI

**KGS Usage:** ❌ FORBIDDEN (Level 2 Professional intensity)

---

## 2. Motion Intensity Scale (1–5)

Every project must declare motion intensity level.

| Level | Name | Duration Range | Complexity | Use Cases |
|-------|------|----------------|------------|-----------|
| 1 | Minimal | 100ms | Opacity only | Clinical dashboards, terminals |
| 2 | Subtle | 120-180ms | Simple transforms | SaaS, enterprise, admin |
| 3 | Standard | 180-240ms | Multi-property | Consumer apps, marketing |
| 4 | Layered | 240-400ms | Staggered, layered | Creative portfolios, premium |
| 5 | Cinematic | 400ms+ | Choreographed | Wedding, events, storytelling |

### KGS Declaration

**Project:** Knowledge Graph Studio  
**Motion Intensity:** **Level 2 — Subtle**

**Applied Decisions:**

| Aspect | Level 2 Standard | KGS Implementation |
|--------|------------------|-------------------|
| Hover | 120ms, single property | `transition-shadow duration-120` |
| Toggle | 180ms, translate | Sidebar `transition-all duration-300` |
| Modal | 200ms, fade+scale | Not yet implemented |
| Page | None (instant) | Instant navigation |

---

## Rule: No Intensity Mixing

**A project must maintain consistent motion intensity.**

### Forbidden
- ❌ Level 2 dashboard with Level 5 hero parallax
- ❌ Level 2 buttons with Level 4 loading animations
- ❌ Level 2 cards with Level 3 hover transforms

### Allowed
- ✅ Level 2 throughout (KGS standard)
- ✅ Level 2 primary with Level 1 decorative (more restrained)
- ✅ Level 2 functional with Level 3 feedback (slightly enhanced)

---

## 3. Motion Rules

### Rule 1: No Random Animation

**Every animation must have a declared purpose.**

```tsx
// ❌ REJECTED: Decorative animation
<div className="animate-pulse">
  <Card>Content</Card>
</div>

// ✅ APPROVED: Functional animation
<Card className="transition-shadow duration-120 hover:shadow-lg">
  Content
</Card>
```

### Rule 2: Motion Reinforces Hierarchy

**More important = more motion budget.**

| Element | Priority | Motion Budget |
|---------|----------|---------------|
| Primary CTA | High | Subtle hover + press |
| Secondary Button | Medium | Subtle hover only |
| Tertiary Link | Low | Color shift only |
| Decorative | None | No motion |

### Rule 3: Duration System Enforcement

**All animations must use defined duration tiers:**

| Tier | Duration | Easing | Usage |
|------|----------|--------|-------|
| Fast | 120ms | `ease-out` | Hover, feedback |
| Normal | 180ms | `ease-out` | Toggle, collapse |
| Smooth | 240ms | `ease-in-out` | Modal, page |

**Forbidden:**
- ❌ `duration-[150ms]` (arbitrary)
- ❌ `transition-all` (no duration specified)
- ❌ `style={{ transition: 'all 0.3s' }}` (inline, no system)

### Rule 4: Entrance Animations Once Per Session

**Entrance animations (fade-in, slide-up) happen only once.**

```tsx
// ✅ Correct: Animate on mount only
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

<div className={`transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
  Content
</div>

// ❌ Wrong: Animate on every render
<div className="animate-fade-in">
  Content
</div>
```

### Rule 5: Respect Reduced Motion

**Always support `prefers-reduced-motion`:**

```tsx
// ✅ Correct
<div className="transition-transform duration-120 motion-reduce:transition-none">
  Content
</div>

// ❌ Wrong: No reduced motion support
<div className="animate-spin">
  <Loader />
</div>
```

---

## Motion Implementation Guide

### Tailwind Configuration

```ts
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        '120': '120ms',
        '180': '180ms',
        '240': '240ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}
```

### Framer Motion Configuration

```ts
// lib/motion.ts
export const motionConfig = {
  fast: { duration: 0.12, ease: 'easeOut' },
  normal: { duration: 0.18, ease: 'easeOut' },
  smooth: { duration: 0.24, ease: 'easeInOut' },
}

export const variants = {
  hover: {
    scale: 1.02,
    transition: motionConfig.fast,
  },
  press: {
    scale: 0.98,
    transition: motionConfig.fast,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: motionConfig.smooth,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: motionConfig.smooth,
  },
}
```

---

## KGS Motion Specification

```yaml
Project: Knowledge Graph Studio
Intensity: Level 2 — Subtle

Allowed Categories:
  - Functional: ✅ PRIMARY
  - Feedback: ✅ PRIMARY
  - Narrative: ⚠️ LIMITED (onboarding only)
  - Emotional: ❌ FORBIDDEN

Duration Tiers:
  Fast: 120ms (hover, press, focus)
  Normal: 180ms (toggle, collapse, dropdown)
  Smooth: 240ms (modal, if implemented)

Easing:
  Standard: ease-out
  Smooth: ease-in-out

Components:
  Button:
    Hover: shadow shift, 120ms
    Press: scale 0.98, 120ms
  Card:
    Hover: shadow-lg, 120ms
  Sidebar:
    Toggle: translate, 300ms (slightly longer for smooth feel)
  Table Row:
    Hover: bg-muted/30, 120ms

Reduced Motion:
  Respect prefers-reduced-motion: always
```

---

## Motion Audit Checklist

Design Director must verify:

### Purpose
- [ ] Every animation has a declared category
- [ ] Category matches project intensity level
- [ ] No decorative/purposeless motion

### Duration
- [ ] All durations from tier system (120/180/240ms)
- [ ] No arbitrary values (`duration-[150ms]`)
- [ ] Consistent timing throughout

### Intensity
- [ ] Motion intensity matches project declaration
- [ ] No Level 5 in Level 2 project
- [ ] No intensity mixing across sections

### Accessibility
- [ ] `prefers-reduced-motion` respected
- [ ] No infinite animations
- [ ] No flashing/strobing effects

### Performance
- [ ] Animations use transform/opacity (GPU-accelerated)
- [ ] No layout thrashing animations
- [ ] Entrance animations once per session

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
