# Dual-Phase Workflow

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

All UI work follows a strict dual-phase process. Design and implementation are separate concerns.

**Principle:** Design thinks. Implementation builds. Never both at once.

---

## Phase A — Design Pass

### Actor: Design Director Only

**Implementation team does NOT participate in Phase A.**

### Duration: 1-2 days (depending on scope)

### Deliverables

1. **Layout Plan**
   - Wireframe or sketch
   - Component hierarchy
   - Section breakdown
   - Grid specification

2. **Token Mapping**
   ```markdown
   ## Token Map
   
   | Element | Spacing | Depth | Typography | Color |
   |---------|---------|-------|------------|-------|
   | Section | xl (32px) | Level 1 | H2 | background |
   | Card | md (16px) | Level 2 | H3 | card |
   | Button | sm (8px) | Level 2 | Body | primary |
   ```

3. **Depth Mapping**
   ```markdown
   ## Depth Map
   
   | Component | Depth Level | Shadow | Z-Index |
   |-----------|-------------|--------|---------|
   | Page | 0 | none | 0 |
   | Section | 1 | shadow-sm | 10 |
   | Card | 2 | shadow-md | 20 |
   | Modal | 3 | shadow-lg | 30 |
   ```

4. **Motion Plan**
   ```markdown
   ## Motion Plan
   
   | Interaction | Duration | Easing |
   |-------------|----------|--------|
   | Hover | 120ms (Fast) | ease-out |
   | Sidebar toggle | 180ms (Normal) | ease-out |
   | Modal fade | 240ms (Smooth) | ease-in-out |
   ```

5. **Design Score Forecast**
   ```markdown
   ## Forecasted Score
   
   | Category | Forecast | Rationale |
   |----------|----------|-----------|
   | Hierarchy | 9/10 | Clear visual flow planned |
   | Spacing | 9/10 | Token-only values |
   | Depth | 8/10 | 4-level system followed |
   | Typography | 9/10 | Scale adherence |
   | Interaction | 8/10 | All states defined |
   | Consistency | 9/10 | Profile-aligned |
   | Navigation | 10/10 | Invariants satisfied |
   
   **Overall Forecast:** 8.9/10 ✅
   ```

### Forbidden in Phase A
- ❌ NO CODE WRITTEN
- ❌ NO implementation details
- ❌ NO component creation
- ❌ NO styling

### Approval Gate

Design Director must approve Phase A deliverables before Phase B begins.

**Approval Criteria:**
- [ ] Layout plan complete
- [ ] Token mapping complete
- [ ] Depth mapping complete
- [ ] Motion plan complete
- [ ] Score forecast ≥ 8.5
- [ ] Hard constraints satisfied
- [ ] Design profile referenced

**If rejected:**
- Revise Phase A deliverables
- Resubmit for approval
- Do NOT proceed to Phase B

---

## Phase B — Implementation Pass

### Actor: Frontend Team Only

**Design Director does NOT write code in Phase B.**

### Duration: As estimated (based on approved plan)

### Inputs (Consumes)

1. **Approved Design Plan** (from Phase A)
2. **Token Architecture** (`token-architecture.md`)
3. **Hard Constraints** (`hard-constraints.md`)
4. **Design Profile** (`design-profile.md`)

### Rules

1. **Implement Exactly**
   - Follow token mapping precisely
   - Use depth levels as specified
   - Apply motion durations as planned
   - No creative deviation

2. **No Design Decisions**
   - If something is unclear → ask Design Director
   - If token missing → request addition (don't invent)
   - If constraint conflict → escalate (don't compromise)

3. **No Scope Creep**
   - Implement what was approved
   - Additional features → new Phase A
   - "While I'm here" changes → forbidden

### Forbidden in Phase B
- ❌ NO design decisions
- ❌ NO token invention
- ❌ NO constraint compromise
- ❌ NO "creative improvements"

### Output

1. **Working Component/Page**
2. **Implementation Notes** (any deviations from plan)
3. **Self-Review Checklist** (constraint validation)

---

## Phase Separation Enforcement

### Forbidden Overlaps

| Scenario | Violation | Consequence |
|----------|-----------|-------------|
| Designer writes code in Phase A | Phase overlap | Warning |
| Developer makes design decisions in Phase B | Phase overlap | Rejection |
| Phase B starts before Phase A approval | Process violation | Block merge |
| Design changes during Phase B | Scope creep | New Phase A required |

### Detection

**PR Review Checklist:**
- [ ] Phase A approval attached?
- [ ] Design Plan referenced?
- [ ] Token mapping followed?
- [ ] Depth levels correct?
- [ ] Motion durations match plan?

**If any unchecked:**
- ❌ PR blocked
- ⚠️ Designer notified
- 🔄 Return to Phase A if needed

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE A — DESIGN PASS                    │
│  Actor: Design Director                                     │
│  Output: Layout Plan + Token Map + Depth Map + Motion Plan │
│  Rule: NO CODE WRITTEN                                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Design Review │
                  │ Score ≥ 8.5?  │
                  └───────┬───────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
            YES                     NO
              │                       │
              ▼                       │
┌─────────────────────────┐           │
│   PHASE B — IMPLEMENT   │           │
│   Actor: Frontend       │           │
│   Input: Approved Plan  │           │
│   Rule: NO DESIGN       │           │
│         DECISIONS       │           │
└─────────────────────────┘           │
              │                       │
              ▼                       │
┌─────────────────────────┐           │
│   Constraint Validation │           │
│   - Depth check         │           │
│   - Spacing check       │           │
│   - Accent check        │           │
│   - Motion check        │           │
└─────────────────────────┘           │
              │                       │
              ▼                       │
┌─────────────────────────┐           │
│   Visual Audit          │◄──────────┘
│   Score ≥ 8.5?          │   Revise Phase A
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
  YES             NO
    │               │
    ▼               │
✅ APPROVED        │
Merge allowed      │
                   │
            Revise & Resubmit
```

---

## Self-Review Checklist (Phase B)

Before submitting PR, developer must complete:

### Constraint Validation

```markdown
## Constraint Checklist

### Depth
- [ ] All components use 4-level system
- [ ] No Level 4+ shadows
- [ ] Z-index values in system (0, 10, 20, 30)

### Spacing
- [ ] All values from spacing scale
- [ ] No arbitrary values (`p-[13px]`)
- [ ] Section spacing ≥ xl (32px)
- [ ] Card padding = md or lg

### Accent
- [ ] Single accent color used
- [ ] Accent ≤ 10% of viewport
- [ ] No rainbow UI
- [ ] No emoji in SaaS mode

### Motion
- [ ] Durations from tiers (120/180/240ms)
- [ ] No animation > 300ms
- [ ] No spring animations
```

### Token Reference

```markdown
## Token Usage

| Element | Token Used | Constraint Reference |
|---------|------------|---------------------|
| Section margin | `mt-8` (xl) | Spacing Tier: Section-to-section |
| Card padding | `p-6` (lg) | Spacing Tier: Card padding |
| Button | `px-4 py-2` (md) | Spacing Tier: Button internal |
| Card shadow | `shadow-md` | Depth: Level 2 |
| Hover shadow | `hover:shadow-lg` | Depth: Level 3 |
```

---

## Exception Process

**Emergency fixes** may bypass dual-phase with:
1. CTO approval
2. Post-fix Design Review within 48 hours
3. Incident report filed

**Experimental features** may use relaxed process with:
1. `[EXPERIMENTAL]` tag in PR
2. Not for production
3. Full dual-phase before production merge

---

## Template: Phase A Deliverable

```markdown
# Design Plan — [Component/Page]

**Date:** YYYY-MM-DD
**Designer:** Design Director Agent
**Project:** [Project Name]

## Layout Plan

[Wireframe or description]

## Token Map

| Element | Spacing | Depth | Typography | Color |
|---------|---------|-------|------------|-------|
| ... | ... | ... | ... | ... |

## Depth Map

| Component | Level | Shadow | Z-Index |
|-----------|-------|--------|---------|
| ... | ... | ... | ... |

## Motion Plan

| Interaction | Duration | Easing |
|-------------|----------|--------|
| ... | ... | ... |

## Score Forecast

| Category | Forecast | Rationale |
|----------|----------|-----------|
| ... | ... | ... |

**Overall Forecast:** X.X/10

## Design Profile Reference

- Personality: [from design-profile.md]
- Tone: [from design-profile.md]
- Density: [from design-profile.md]

## Hard Constraints Validation

- [ ] Depth: 4-level system followed
- [ ] Spacing: Scale enforced
- [ ] Accent: Single color, ≤10%
- [ ] Motion: Tiers followed

## Approval

**Status:** ✅ APPROVED / ❌ REJECTED
**Approved by:** Design Director
**Date:** YYYY-MM-DD
```

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
