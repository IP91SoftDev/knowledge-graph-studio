# Design Review Process

**Version:** 1.1  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

All UI must pass through Design Review before implementation. No exceptions.

**Principle:** Design is a verb, not a noun. Review is the catalyst.

---

## Reference Library

Design Director consults these reference skills during evaluation:

### Primary Reference: ui-ux-design

**Skill:** `ui-ux-design` (itsjustdri)  
**Audit Report:** `/docs/design/skill-audit-ui-ux-design.md`  
**Status:** ✅ APPROVED FOR REFERENCE USE

**Usage:**
- Spacing rationale validation (8px multiples)
- Typography scale reference (8px baseline)
- Accessibility guidelines (WCAG 2.2)
- Micro-interaction best practices (0.2-0.3s)
- Shadcn/ui + Tailwind patterns
- Mobile-first responsive design

**Constraint:** Reference ONLY — does not write code or make decisions

### Secondary References

| Reference | Purpose |
|-----------|---------|
| hard-constraints.md | Depth/spacing/accent/motion rules |
| emotional-layer.md | Emotional intensity validation |
| typography-authority.md | Typography role enforcement |
| motion-framework.md | Motion category validation |
| visual-hierarchy.md | Attention model enforcement |
| personality-matrix.md | Archetype consistency |
| design-profile.md | Project identity |
| token-architecture.md | Token system reference |

---

## Design Director Responsibilities

### 1. Score UI 1–10

Using the Evaluation Model (`evaluation-model.md`) AND reference skills:

| Category | Weight | Reference Sources |
|----------|--------|-------------------|
| Visual Hierarchy | 20% | visual-hierarchy.md + ui-ux-design |
| Spacing Rhythm | 15% | hard-constraints.md + ui-ux-design |
| Depth & Elevation | 15% | hard-constraints.md |
| Typography | 15% | typography-authority.md + ui-ux-design |
| Interaction Polish | 15% | motion-framework.md + ui-ux-design |
| Consistency | 10% | personality-matrix.md + design-profile.md |
| Navigation & Accessibility | 10% | hard-constraints.md + ui-ux-design (WCAG) |

**Score Calculation:**
```
Overall = Σ(Category Score × Weight)
```

### 2. Provide 3 Strengths

Must identify what works:
```markdown
**Strengths:**
1. [Specific element done well] — [reference to constraint/token/skill]
2. [Specific token usage correct] — [reference to skill insight]
3. [Specific pattern properly applied] — [reference to skill guideline]
```

**Example with Skill Reference:**
```markdown
**Strengths:**
1. "4-up KPI grid uses gap-4 consistently" — aligns with ui-ux-design spacing multiples
2. "Card shadows follow Level 2 depth tier" — matches hard-constraints.md
3. "Status badges use functional color system" — matches ui-ux-design semantic colors
```

### 3. Provide 3 Weaknesses

Must identify what needs improvement WITH skill references:
```markdown
**Weaknesses:**
1. [Specific violation] — violates [Constraint X] per [skill reference]
2. [Specific inconsistency] — conflicts with [skill guideline]
3. [Specific missing element] — required by [accessibility guideline]
```

**Example with Skill Reference:**
```markdown
**Weaknesses:**
1. "Section uses mt-6 (24px) instead of mt-8 (32px)" — violates spacing tier; ui-ux-design states "Section spacing: 48-64px minimum"
2. "Card uses shadow-xl (Level 4) instead of shadow-md (Level 2)" — violates Depth Constraint 2
3. "Missing focus states on buttons" — violates ui-ux-design accessibility: "Focus states visible (3:1 contrast)"
```

### 4. Provide 3 Precise Fixes

Must provide actionable corrections with skill backing:
```markdown
**Required Fixes:**
1. [Exact change] — Change `[current]` to `[correct]` at [location] per [skill reference]
2. [Exact change] — Change `[current]` to `[correct]` at [location] per [skill reference]
3. [Exact change] — Add `[missing]` at [location] per [skill reference]
```

**Example with Skill Reference:**
```markdown
**Required Fixes:**
1. "Change `mt-6` to `mt-8` in Section component (line 45)" — ui-ux-design: "Section spacing 48-64px minimum"
2. "Replace `shadow-xl` with `shadow-md` per Depth Constraint 2" — hard-constraints.md: Level 2 for cards
3. "Add `focus-visible:ring-2 focus-visible:ring-ring` to Button component" — ui-ux-design: "Focus states visible"
```

---

## Design Director Agent Responsibilities

### 1. Score UI 1–10

Using the Evaluation Model (`evaluation-model.md`):

| Category | Weight |
|----------|--------|
| Visual Hierarchy | 20% |
| Spacing Rhythm | 15% |
| Depth & Elevation | 15% |
| Typography | 15% |
| Interaction Polish | 15% |
| Consistency | 10% |
| Navigation & Accessibility | 10% |

**Score Calculation:**
```
Overall = Σ(Category Score × Weight)
```

### 2. Provide 3 Strengths

Must identify what works:
```markdown
**Strengths:**
1. [Specific element done well]
2. [Specific token usage correct]
3. [Specific pattern properly applied]
```

**Forbidden:**
- ❌ Vague praise ("looks nice")
- ❌ Generic compliments ("good job")
- ❌ Non-specific feedback ("good colors")

**Required:**
- ✅ "4-up KPI grid uses gap-4 consistently"
- ✅ "Card shadows follow Level 2 depth tier"
- ✅ "Status badges use functional color system"

### 3. Provide 3 Weaknesses

Must identify what needs improvement:
```markdown
**Weaknesses:**
1. [Specific violation with reference]
2. [Specific inconsistency]
3. [Specific missing element]
```

**Forbidden:**
- ❌ Vague criticism ("feels off")
- ❌ Generic complaints ("needs work")
- ❌ Non-specific feedback ("spacing wrong")

**Required:**
- ✅ "Section uses mt-6 (24px) instead of mt-8 (32px) — violates spacing tier"
- ✅ "Card uses shadow-xl (Level 4) instead of shadow-md (Level 2) — violates depth constraint"
- ✅ "Missing hover state on interactive table rows"

### 4. Provide 3 Precise Fixes

Must provide actionable corrections:
```markdown
**Required Fixes:**
1. [Exact change with token reference]
2. [Exact change with constraint reference]
3. [Exact change with implementation detail]
```

**Forbidden:**
- ❌ Vague direction ("fix spacing")
- ❌ Generic advice ("improve hierarchy")
- ❌ Non-actionable feedback ("make it better")

**Required:**
- ✅ "Change `mt-6` to `mt-8` in Section component (line 45)"
- ✅ "Replace `shadow-xl` with `shadow-md` per Depth Constraint 2"
- ✅ "Add `hover:bg-muted/30` to TableRow component"

---

## Minimum Approval Scores

| Project Type | Minimum Score | Rationale |
|--------------|---------------|-----------|
| Dashboards (Admin) | 8.5/10 | Functional clarity priority |
| Marketing Sites | 9.0/10 | Brand representation critical |
| Wedding Sites | 9.5/10 | Emotional impact essential |
| E-commerce | 9.0/10 | Conversion optimization |
| SaaS Products | 8.5/10 | Usability priority |

**Current Project (KGS):** Dashboard → **8.5/10 minimum**

---

## Review Workflow

```
┌─────────────────────────────────────────────────────────┐
│  SUBMISSION                                             │
│  Designer submits Design Plan (Phase A)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  DESIGN DIRECTOR REVIEW                                 │
│  1. Load hard-constraints.md                            │
│  2. Load design-profile.md                              │
│  3. Load token-architecture.md                          │
│  4. Score against evaluation-model.md                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   Score ≥ 8.5              Score < 8.5
        │                         │
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│ APPROVED      │         │ REJECTED      │
│ - 3 strengths │         │ - 3 strengths │
│ - 3 weaknesses│         │ - 3 weaknesses│
│ - 3 fixes     │         │ - 3 fixes     │
│ - Proceed to  │         │ - Revise &    │
│   Phase B     │         │   resubmit    │
└───────────────┘         └───────────────┘
```

---

## Review Output Format

```markdown
# Design Review — [Component/Page Name]

**Date:** YYYY-MM-DD
**Reviewer:** Design Director Agent
**Project:** [Project Name]
**URL/Path:** [page or component path]

## Score

**Overall:** X.X/10

| Category | Score | Notes |
|----------|-------|-------|
| Hierarchy | X/10 | ... |
| Spacing | X/10 | ... |
| Depth | X/10 | ... |
| Typography | X/10 | ... |
| Interaction | X/10 | ... |
| Consistency | X/10 | ... |
| Navigation | X/10 | ... |

## Strengths

1. **[Specific strength]** — [reference to constraint/token]
2. **[Specific strength]** — [reference to constraint/token]
3. **[Specific strength]** — [reference to constraint/token]

## Weaknesses

1. **[Specific weakness]** — [violates Constraint X / uses wrong token]
2. **[Specific weakness]** — [violates Constraint X / uses wrong token]
3. **[Specific weakness]** — [violates Constraint X / uses wrong token]

## Required Fixes

1. **[Exact fix]** — Change `[current]` to `[correct]` at [location]
2. **[Exact fix]** — Change `[current]` to `[correct]` at [location]
3. **[Exact fix]** — Change `[current]` to `[correct]` at [location]

## Constraint References

- Depth: [Level X violated / correct]
- Spacing: [Tier X violated / correct]
- Accent: [Within limits / exceeded]
- Motion: [Correct tier / violation]

## Decision

✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

## Next Review

[Date for re-review if conditional/rejected]
```

---

## Token Violation References

When citing violations, reference specific tokens:

### Spacing Violations
```
❌ Wrong: `mt-6` (24px not in section spacing scale)
✅ Correct: `mt-8` (32px = xl tier for sections)
Constraint: Spacing Tier Enforcement, Section-to-section rule
```

### Depth Violations
```
❌ Wrong: `shadow-xl` (Level 4+ not allowed)
✅ Correct: `shadow-md` (Level 2 for cards)
Constraint: Depth Layer Rules, 4-Level System
```

### Accent Violations
```
❌ Wrong: `bg-purple-500` (non-system accent)
✅ Correct: `bg-primary` (system accent)
Constraint: Accent Saturation Limits, Single Accent Rule
```

### Motion Violations
```
❌ Wrong: `duration-[150ms]` (arbitrary, not in tiers)
✅ Correct: `duration-120` (Fast tier)
Constraint: Motion Duration System, 120/180/240ms tiers
```

---

## Re-Review Process

If rejected or conditional:

1. **Designer makes fixes** per Required Fixes list
2. **Designer responds** to review with:
   ```markdown
   ## Fix Responses
   
   1. ✅ Fixed — Changed `mt-6` to `mt-8` at line 45
   2. ✅ Fixed — Changed `shadow-xl` to `shadow-md` at line 23
   3. ✅ Fixed — Added `hover:bg-muted/30` to TableRow
   ```
3. **Design Director re-reviews** within 24 hours
4. **Score updated**, decision confirmed or revised

---

## Appeal Process

If designer disagrees with review:

1. **Submit Appeal** within 48 hours:
   ```markdown
   ## Appeal Request
   
   **Review Date:** YYYY-MM-DD
   **Disputed Score:** X.X/10
   **Requested Score:** Y.Y/10
   
   **Rationale:**
   - [Why score should differ]
   - [Evidence from constraints/profile]
   
   **Alternative Interpretation:**
   - [How constraint was actually satisfied]
   ```

2. **Second Review** by senior designer or CTO
3. **Final Decision** within 72 hours
4. **Precedent logged** for future reference

---

## Review Log

All reviews logged in `/docs/design/reviews/`:

```
/docs/design/reviews/
├── 2026-03-03-dashboard.md
├── 2026-03-05-profile-page.md
├── 2026-03-10-settings.md
└── monthly-summary-2026-03.md
```

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
