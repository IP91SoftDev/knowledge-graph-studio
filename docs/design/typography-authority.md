# Typography Authority

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

Typography is the voice of design. It speaks before content is read.

**Principle:** Typography is system, not style.

---

## 1. Typography Roles

Every text element must fit one of these roles. No arbitrary categories.

| Role | Purpose | Scale Reference |
|------|---------|-----------------|
| Display | Hero statements, landing headlines | 48px+ (3xl+) |
| Heading | Page titles, major sections | 30-40px (2xl-xl) |
| Subheading | Section headers, card titles | 20-24px (xl-lg) |
| Body | Primary content, paragraphs | 16px (base) |
| Caption | Secondary info, timestamps | 12-14px (xs-sm) |
| Label | Form labels, button text | 14px (sm) |
| Data | Numbers, tables, metrics | 14-16px (sm-base) |

### Role Specifications

#### Display

```yaml
Font: Inter (or project-defined display face)
Weight: 700 (bold)
Letter Spacing: -0.02em (tight for impact)
Line Height: 1.1 (tight)
Usage: Hero sections, landing pages only
Context: Never in dashboards or admin UI
```

#### Heading

```yaml
Font: Inter
Weight: 700 (bold)
Letter Spacing: -0.01em
Line Height: 1.2
Usage: Page titles (H1)
Context: One per page
```

#### Subheading

```yaml
Font: Inter
Weight: 600 (semibold)
Letter Spacing: 0
Line Height: 1.3
Usage: Section headers (H2), card titles
Context: Multiple per page OK
```

#### Body

```yaml
Font: Inter
Weight: 400 (normal)
Letter Spacing: 0
Line Height: 1.5 (readable)
Usage: Paragraphs, descriptions
Context: Primary content container
```

#### Caption

```yaml
Font: Inter
Weight: 400 (normal)
Letter Spacing: 0.01em
Line Height: 1.4
Usage: Timestamps, secondary info, hints
Context: Supporting content only
```

#### Label

```yaml
Font: Inter
Weight: 500 (medium)
Letter Spacing: 0.02em (slight tracking)
Line Height: 1.3
Usage: Form labels, button text, badges
Context: UI controls
```

#### Data

```yaml
Font: Inter (or JetBrains Mono for code-like data)
Weight: 500 (medium) for numbers, 400 for text
Letter Spacing: -0.01em (tight for numbers)
Line Height: 1.4
Usage: KPI values, table cells, metrics
Context: Data-dense interfaces
```

---

## Forbidden Typography

- ❌ Arbitrary font sizes (`text-[15px]`, `text-[19px]`)
- ❌ Arbitrary weights (`font-[550]`)
- ❌ Arbitrary line heights (`leading-[1.37]`)
- ❌ Role mixing (Display in dashboard, Body in hero)
- ❌ More than 2 font families per project

---

## 2. Typography Personality Engine

Each project must declare its typography personality.

### Personality Dimensions

| Dimension | Options | KGS Selection |
|-----------|---------|---------------|
| Serif vs Sans | Serif / Sans / Mixed | **Sans** |
| Geometric vs Humanist | Geometric / Humanist / Neutral | **Geometric** |
| Compact vs Open | Compact / Neutral / Open | **Neutral** |
| Editorial vs Technical | Editorial / Neutral / Technical | **Technical** |

### KGS Typography Profile

**Primary Font:** Inter  
**Fallback:** system-ui, -apple-system, sans-serif  
**Mono Font:** JetBrains Mono (for IDs, code snippets)

**Personality:** Modern, clean, technical, efficient

**Why:** KGS is an enterprise tool. Typography should feel competent and readable, not expressive or decorative.

---

### Font Personality Reference

| Project Type | Serif/Sans | Geometric/Humanist | Compact/Open | Editorial/Technical |
|--------------|------------|--------------------|--------------|---------------------|
| SaaS Dashboard | Sans | Geometric | Neutral | Technical |
| Wedding Site | Serif or Mixed | Humanist | Open | Editorial |
| Marketing Site | Sans or Mixed | Humanist | Open | Editorial |
| Portfolio | Sans | Geometric | Open | Editorial |
| E-commerce | Sans | Humanist | Neutral | Technical |
| News/Editorial | Serif | Humanist | Open | Editorial |
| Developer Tool | Sans | Geometric | Compact | Technical |

---

## 3. Rhythm Enforcement

### Vertical Rhythm System

Typography must align to a consistent vertical grid.

**Base Unit:** 4px (0.25rem)

**Line Height × Font Size must equal multiple of base unit:**

```
Font Size: 16px (base)
Line Height: 1.5 (24px)
Result: 24px = 6 × 4px ✅

Font Size: 14px (sm)
Line Height: 1.429 (20px)
Result: 20px = 5 × 4px ✅

Font Size: 20px (xl)
Line Height: 1.4 (28px)
Result: 28px = 7 × 4px ✅
```

### Spacing Alignment

**Paragraph spacing must align with line height:**

```
Body line height: 24px
Paragraph margin: 24px (mt-6) ✅
Section margin: 32px (mt-8) ✅
```

### Baseline Grid

All text baselines should align across columns:

```tsx
// ✅ Correct: Aligned baselines
<div className="grid grid-cols-2 gap-8">
  <div className="leading-6">...</div>
  <div className="leading-6">...</div>
</div>

// ❌ Wrong: Misaligned baselines
<div className="grid grid-cols-2 gap-8">
  <div className="leading-5">...</div>
  <div className="leading-7">...</div>
</div>
```

---

## Typography Violation Examples

### ❌ REJECTED

```tsx
// Arbitrary font size
<h1 className="text-[27px]">Title</h1>

// Arbitrary weight
<p className="font-[550]">Text</p>

// Arbitrary line height
<div className="leading-[1.37]">Content</div>

// Role mixing (Display in dashboard)
<div className="text-5xl font-bold">Dashboard Stats</div>

// Too many fonts
<div className="font-geist">
  <span className="font-inter">Text</span>
  <span className="font-mono">Data</span>
  <span className="font-custom">Logo</span>
</div>
```

### ✅ APPROVED

```tsx
// Role-appropriate sizes
<h1 className="text-2xl font-bold">Page Title</h1>
<h2 className="text-xl font-semibold">Section</h2>
<h3 className="text-lg font-medium">Subsection</h3>
<p className="text-base">Body text</p>
<span className="text-sm">Caption</span>

// System weights only
<p className="font-normal">Regular</p>
<p className="font-medium">Medium</p>
<p className="font-semibold">Semibold</p>
<p className="font-bold">Bold</p>

// Aligned line heights
<p className="text-base leading-6">Body with 24px line height</p>
<span className="text-sm leading-5">Caption with 20px line height</span>
```

---

## Typography Audit Checklist

Design Director must verify:

### Role Assignment
- [ ] Every text element has a role (Display/Heading/Subheading/Body/Caption/Label/Data)
- [ ] Role matches usage context
- [ ] No role mixing within same hierarchy level

### Scale Adherence
- [ ] All sizes from typography scale
- [ ] No arbitrary values (`text-[15px]`)
- [ ] Consistent progression (no 14px → 18px → 16px jumps)

### Weight Consistency
- [ ] Weights from system (400/500/600/700)
- [ ] No arbitrary weights (`font-[550]`)
- [ ] Weight hierarchy clear (heading > body > caption)

### Line Height Alignment
- [ ] Line heights align to 4px grid
- [ ] Vertical rhythm maintained
- [ ] Baselines align across columns

### Personality Match
- [ ] Font choice matches project personality
- [ ] No more than 2 font families
- [ ] Mono used only for code/data

---

## KGS Typography Specification

```yaml
Project: Knowledge Graph Studio
Personality: Modern, clean, technical

Primary Font:
  Family: Inter
  Weights: 400, 500, 600, 700
  Usage: All UI text

Mono Font:
  Family: JetBrains Mono
  Weights: 400, 500
  Usage: IDs, code snippets, technical data

Scale:
  Display: Not used (dashboard project)
  Heading (H1): text-2xl (24px) / 700 / 1.2
  Subheading (H2): text-xl (20px) / 600 / 1.3
  Subheading (H3): text-lg (18px) / 500 / 1.4
  Body: text-base (16px) / 400 / 1.5
  Caption: text-sm (14px) / 400 / 1.4
  Label: text-sm (14px) / 500 / 1.3
  Data: text-base (16px) / 500 / 1.4 (numbers: tabular-nums)

Vertical Rhythm:
  Base Unit: 4px
  Body Line Height: 24px (6 units)
  Paragraph Spacing: 24px (mt-6)
  Section Spacing: 32px (mt-8)
```

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
