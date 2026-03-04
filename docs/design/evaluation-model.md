# Design Evaluation Model

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Minimum Score:** 8/10 for approval

---

## Overview

All UI must be evaluated against this model before approval. Scores below 8/10 require revision.

---

## Scoring Categories

### 1. Visual Hierarchy (Weight: 20%)

**Evaluation Criteria:**
- [ ] Clear distinction between H1, H2, H3, body text
- [ ] Important elements are visually prominent
- [ ] Eye flow is guided naturally through content
- [ ] No competing focal points
- [ ] Proper use of size, weight, and color for emphasis

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | Perfect hierarchy, instant clarity |
| 8-9/10 | Clear hierarchy, minor improvements possible |
| 6-7/10 | Hierarchy exists but unclear in places |
| 4-5/10 | Hierarchy weak, elements compete |
| 1-3/10 | No clear hierarchy, chaotic |

---

### 2. Spacing Rhythm (Weight: 15%)

**Evaluation Criteria:**
- [ ] Consistent spacing scale used (no ad-hoc values)
- [ ] Related elements grouped with appropriate gaps
- [ ] Sections have clear separation
- [ ] White space used intentionally
- [ ] Density matches project profile

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | Perfect rhythm, token-only values |
| 8-9/10 | Consistent, 1-2 ad-hoc values |
| 6-7/10 | Some inconsistency, several ad-hoc values |
| 4-5/10 | Inconsistent rhythm, many ad-hoc values |
| 1-3/10 | Chaotic spacing, no system |

---

### 3. Depth & Elevation (Weight: 15%)

**Evaluation Criteria:**
- [ ] Shadow system followed consistently
- [ ] Surface tiers clear (base, raised, overlay, floating)
- [ ] Dark mode shadows recalibrated
- [ ] Elevation matches element importance
- [ ] No flat elements that should be elevated

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | Perfect depth system, both themes |
| 8-9/10 | Clear depth, minor adjustments needed |
| 6-7/10 | Some depth, inconsistent application |
| 4-5/10 | Flat or random shadows |
| 1-3/10 | No depth system |

---

### 4. Typography (Weight: 15%)

**Evaluation Criteria:**
- [ ] Type scale followed (no arbitrary sizes)
- [ ] Line heights appropriate for readability
- [ ] Font weights used intentionally
- [ ] Contrast meets WCAG AA in both themes
- [ ] Hierarchy matches design profile

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | Perfect typography, accessible |
| 8-9/10 | Strong typography, minor tweaks |
| 6-7/10 | Readable but inconsistent |
| 4-5/10 | Typography issues, contrast concerns |
| 1-3/10 | Poor typography, inaccessible |

---

### 5. Interaction Polish (Weight: 15%)

**Evaluation Criteria:**
- [ ] All interactive elements have hover states
- [ ] Focus states visible and accessible
- [ ] Active/disabled states defined
- [ ] Loading states considered
- [ ] Motion is purposeful (not decorative)

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | All states defined, motion purposeful |
| 8-9/10 | Most states defined, good motion |
| 6-7/10 | Basic states, missing some |
| 4-5/10 | Minimal states, no motion consideration |
| 1-3/10 | No interactive states |

---

### 6. Consistency (Weight: 10%)

**Evaluation Criteria:**
- [ ] Matches project design profile
- [ ] Consistent with existing pages
- [ ] Token values used (no ad-hoc)
- [ ] Component patterns followed
- [ ] No one-off solutions

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | Perfectly consistent, profile-aligned |
| 8-9/10 | Mostly consistent, minor deviations |
| 6-7/10 | Some inconsistency |
| 4-5/10 | Inconsistent with profile/system |
| 1-3/10 | Completely inconsistent |

---

### 7. Navigation & Accessibility (Weight: 10%)

**Evaluation Criteria:**
- [ ] Navigation invariants satisfied
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Color not sole indicator
- [ ] Focus management proper

**Scoring:**
| Score | Description |
|-------|-------------|
| 10/10 | Fully accessible, invariants met |
| 8-9/10 | Accessible, minor improvements |
| 6-7/10 | Basic accessibility, gaps exist |
| 4-5/10 | Accessibility issues |
| 1-3/10 | Inaccessible, invariants violated |

---

## Score Calculation

```
Overall Score = Σ(Category Score × Weight)

Example:
Hierarchy:     9 × 0.20 = 1.80
Spacing:       8 × 0.15 = 1.20
Depth:         8 × 0.15 = 1.20
Typography:    9 × 0.15 = 1.35
Interaction:   8 × 0.15 = 1.20
Consistency:   9 × 0.10 = 0.90
Navigation:    9 × 0.10 = 0.90
─────────────────────────────
TOTAL:                    8.55/10 ✅ APPROVED
```

---

## Decision Matrix

| Score Range | Decision | Action |
|-------------|----------|--------|
| 9.0 - 10.0 | ✅ Exemplary | Approve, consider as reference |
| 8.0 - 8.9 | ✅ Approved | Approve for production |
| 7.0 - 7.9 | ⚠️ Conditional | Fix issues, re-evaluate |
| 6.0 - 6.9 | ❌ Revise | Significant revision needed |
| Below 6.0 | ❌ Rejected | Complete redesign required |

---

## Audit Log Format

```markdown
# Visual Audit — [Page Name]

**Date:** YYYY-MM-DD
**Evaluator:** Design Director Agent
**URL:** [page URL]
**Screenshot:** [path]

## Scores

| Category | Score | Weight | Weighted | Notes |
|----------|-------|--------|----------|-------|
| Hierarchy | X/10 | 20% | X.XX | ... |
| Spacing | X/10 | 15% | X.XX | ... |
| Depth | X/10 | 15% | X.XX | ... |
| Typography | X/10 | 15% | X.XX | ... |
| Interaction | X/10 | 15% | X.XX | ... |
| Consistency | X/10 | 10% | X.XX | ... |
| Navigation | X/10 | 10% | X.XX | ... |

**Overall:** X.XX/10

## Decision

✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

## Required Actions (if conditional/rejected)

- [ ] Action 1
- [ ] Action 2

## Next Review

YYYY-MM-DD
```

---

## Reference Comparisons

When evaluating, compare against:
1. Project design profile
2. Competitive references (from profile)
3. Previous approved pages (consistency)
4. Square UI reference (for KGS)

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
