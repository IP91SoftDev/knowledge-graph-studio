# Visual Hierarchy Engine

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

Visual hierarchy directs attention. Without hierarchy, everything competes. Without competition, nothing stands out.

**Principle:** Attention is limited. Design must respect that.

---

## 1. 5-Layer Attention Model

Every component must map to one of these attention levels.

| Level | Name | Purpose | Visual Treatment | Max per Viewport |
|-------|------|---------|------------------|------------------|
| 1 | Primary Focus | Main action/content | Highest contrast, largest, boldest | 1 |
| 2 | Secondary Focus | Supporting actions | High contrast, prominent | 2-3 |
| 3 | Context | Content body | Standard contrast, readable | Unlimited |
| 4 | Metadata | Secondary info | Low contrast, small | Unlimited |
| 5 | Background | Surface, structure | Minimal contrast, recedes | Unlimited |

### Level Specifications

#### Level 1 — Primary Focus

**Purpose:** The ONE thing users should notice first.

**Visual Treatment:**
- Highest color contrast
- Largest size in context
- Boldest weight (700+)
- Prime position (top-left or center)
- May use accent color

**Examples:**
- Dashboard: Primary KPI or main CTA
- Landing: Hero headline or primary CTA
- Form: Submit button
- Article: Headline

**Rule:** Only ONE Level 1 element per viewport.

---

#### Level 2 — Secondary Focus

**Purpose:** Important but not primary actions/content.

**Visual Treatment:**
- High contrast (but less than Level 1)
- Prominent size
- Semibold weight (600)
- Secondary positions

**Examples:**
- Dashboard: Secondary KPIs, section headers
- Landing: Secondary CTAs, feature highlights
- Form: Important field labels
- Article: Subheadings

**Rule:** Maximum 2-3 Level 2 elements per viewport.

---

#### Level 3 — Context

**Purpose:** Primary content body.

**Visual Treatment:**
- Standard contrast (body text normal)
- Standard size (16px body)
- Normal weight (400)
- Fills available space

**Examples:**
- Dashboard: Data tables, lists
- Landing: Feature descriptions
- Form: Input fields, helper text
- Article: Body paragraphs

**Rule:** Unlimited, but must not compete with Level 1-2.

---

#### Level 4 — Metadata

**Purpose:** Secondary, supplementary information.

**Visual Treatment:**
- Low contrast (muted foreground)
- Small size (12-14px)
- Light or normal weight
- Peripheral positions

**Examples:**
- Dashboard: Timestamps, status badges
- Landing: Testimonial attributions
- Form: Field hints, error messages
- Article: Captions, citations

**Rule:** Unlimited, but must remain clearly secondary.

---

#### Level 5 — Background

**Purpose:** Surface, structure, non-content.

**Visual Treatment:**
- Minimal contrast
- Recedes visually
- Neutral colors
- Structural elements

**Examples:**
- Dashboard: Card backgrounds, dividers
- Landing: Section backgrounds
- Form: Field backgrounds
- Article: Page background

**Rule:** Unlimited, must never compete for attention.

---

## Attention Mapping Example (KGS Dashboard)

| Element | Attention Level | Justification |
|---------|-----------------|---------------|
| Primary KPI (Total Resources) | Level 1 | Main metric, users check first |
| Other KPIs | Level 2 | Important but secondary |
| Quick Actions buttons | Level 2 | Important actions |
| Data table content | Level 3 | Primary content body |
| Status badges | Level 4 | Metadata about items |
| Timestamps | Level 4 | Secondary info |
| Card backgrounds | Level 5 | Surface structure |
| Page background | Level 5 | Base surface |

---

## Rule: Competition = Rejection

**If too many elements compete for Level 1 → REJECT.**

### Forbidden
- ❌ 3+ elements with same high contrast
- ❌ Multiple accent-colored buttons at same level
- ❌ Multiple large headlines competing
- ❌ All cards with Level 1 shadows

### Required
- ✅ Clear visual distinction between levels
- ✅ Level 1 is obviously primary
- ✅ Level 2 is obviously secondary
- ✅ Level 3-5 recede appropriately

---

## 2. Contrast Budget

Attention is limited. Design must budget it.

### Maximum Attention Elements

| Element Type | Max per Viewport | Rationale |
|--------------|------------------|-----------|
| Accent-colored elements | 3 | Accent loses impact if overused |
| Bold typography (700+) | 2 | Bold loses meaning if everywhere |
| High-shadow surfaces (Level 3) | 5 | Elevation hierarchy breaks |
| Large elements (text-2xl+) | 2 | Size hierarchy breaks |
| Animated elements | 3 | Motion becomes noise |

### Budget Calculation

```
Viewport Attention Budget = 100 points

Allocation:
- Level 1 elements: 40 points each (max 1 = 40 points)
- Level 2 elements: 20 points each (max 3 = 60 points)
- Level 3+ elements: 5 points each (unlimited, but budget-aware)

Total must be ≤ 100 points for clear hierarchy.
```

**Example (KGS Dashboard):**
```
Level 1: Primary KPI = 40 points
Level 2: 3 other KPIs = 60 points
Level 3: Table, actions = 20 points
Level 4: Badges, timestamps = 10 points
Level 5: Backgrounds = 0 points

Total: 130 points ⚠️ Slightly over budget
Recommendation: Reduce Level 2 from 3 to 2 KPIs, or accept for dashboard density
```

---

## Visual Hierarchy Checklist

Design Director must verify:

### Attention Mapping
- [ ] Every element mapped to attention level (1-5)
- [ ] Level 1 is clearly primary (only one)
- [ ] Level 2 is clearly secondary (max 3)
- [ ] Level 3-5 recede appropriately

### Contrast Budget
- [ ] Accent elements ≤ 3 per viewport
- [ ] Bold typography ≤ 2 per section
- [ ] High-shadow surfaces ≤ 5 per screen
- [ ] Large elements ≤ 2 per viewport
- [ ] Animated elements ≤ 3 simultaneously

### Competition Check
- [ ] No two Level 1 elements competing
- [ ] Clear visual distinction between levels
- [ ] Hierarchy obvious at a glance
- [ ] Squint test: Level 1 still stands out

### Scannability
- [ ] User can find primary action in 3 seconds
- [ ] Secondary actions discoverable but not competing
- [ ] Content body readable without distraction
- [ ] Metadata visible but not distracting

---

## KGS Visual Hierarchy Specification

```yaml
Project: Knowledge Graph Studio
Attention Model: 5-Layer

Level Assignments:
  Level 1 (Primary):
    - Main KPI (Total Resources)
    - Primary CTA (when present)
    Max: 1 per viewport

  Level 2 (Secondary):
    - Other KPIs (Pending, Approved, Budget)
    - Section headers
    - Quick action buttons
    Max: 3-4 per viewport

  Level 3 (Context):
    - Data table content
    - Card content
    - Body text
    Max: Unlimited

  Level 4 (Metadata):
    - Status badges
    - Timestamps
    - Helper text
    Max: Unlimited

  Level 5 (Background):
    - Card backgrounds
    - Page background
    - Dividers
    Max: Unlimited

Contrast Budget:
  Accent elements: Max 3 (primary buttons, active states)
  Bold typography: Max 2 (H1, key metrics)
  High-shadow: Max 5 (cards, modals)
  Large text: Max 2 (page title, section headers)
  Animated: Max 3 (hover states, sidebar toggle)
```

---

## Hierarchy Violation Examples

### ❌ REJECTED

```tsx
// Too many Level 1 elements
<div>
  <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
  <Button variant="primary">Action 1</Button>
  <Button variant="primary">Action 2</Button>
  <Card className="shadow-xl">Highlighted Card</Card>
</div>
// Issues: 4 Level 1 elements competing

// All bold, nothing stands out
<div>
  <p className="font-bold">Important</p>
  <p className="font-bold">Also Important</p>
  <p className="font-bold">This Too</p>
</div>
// Issues: No hierarchy, everything claims importance
```

### ✅ APPROVED

```tsx
// Clear hierarchy
<div>
  <h1 className="text-2xl font-bold">Dashboard</h1>
  <div className="grid gap-4">
    <Card className="border-primary shadow-md">Primary KPI</Card>
    <Card className="shadow-sm">Secondary KPI 1</Card>
    <Card className="shadow-sm">Secondary KPI 2</Card>
  </div>
  <Button variant="primary">Primary Action</Button>
  <Button variant="outline">Secondary Action</Button>
</div>
// Issues: Clear Level 1 (primary KPI, primary button), Level 2 (other KPIs), Level 3 (cards)
```

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
