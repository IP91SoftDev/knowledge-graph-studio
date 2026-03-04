# Visual Regression Protocol

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Threshold:** 8/10 minimum for approval

---

## Overview

Visual regression testing ensures UI quality is maintained across iterations. Every UI change must be scored and logged.

**Principle:** If it's not scored, it's not approved.

---

## Protocol Steps

### Step 1: Capture Baseline

**Before any UI change:**
```bash
# Screenshot current state
pnpm screenshot --page /dashboard --output baseline.png
```

**Required captures:**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Dark mode
- [ ] Light mode

---

### Step 2: Implement Change

Make UI modifications per design philosophy and token system.

---

### Step 3: Capture Updated

**After UI change:**
```bash
# Screenshot new state
pnpm screenshot --page /dashboard --output updated.png
```

**Same captures as baseline.**

---

### Step 4: Design Director Evaluation

**Evaluator:** Design Director Agent

**Scoring Categories:**

| Category | Weight | Criteria |
|----------|--------|----------|
| Layout & Composition | 20% | Hierarchy, spacing, alignment |
| Typography | 15% | Hierarchy, readability, contrast |
| Color & Theme | 20% | Palette usage, dark mode, contrast |
| Components | 20% | Consistency, states, polish |
| Navigation | 15% | Clarity, accessibility, recovery |
| Motion | 10% | Purpose, timing, reduced-motion |

**Scoring Formula:**
```
Overall = Σ(Category Score × Weight)
```

---

### Step 5: Compare Against Reference

**If reference exists (Square UI, etc.):**
- Compare spacing rhythm
- Compare component density
- Compare color usage
- Note deviations (intentional vs. unintentional)

**If no reference:**
- Compare against previous version
- Ensure no regression in score

---

### Step 6: Log Score

**Location:** `/docs/design/visual-audits/YYYY-MM-DD.md`

**Format:**
```markdown
# Visual Audit — [Page Name]

**Date:** YYYY-MM-DD
**Evaluator:** Design Director Agent
**URL:** [page URL]
**Change:** [description of change]

## Screenshots

- Baseline: [path]
- Updated: [path]
- Diff: [path]

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Layout | X/10 | ... |
| Typography | X/10 | ... |
| Color | X/10 | ... |
| Components | X/10 | ... |
| Navigation | X/10 | ... |
| Motion | X/10 | ... |

**Overall:** X/10

## Decision

✅ APPROVED (≥8/10) / ⚠️ CONDITIONAL (7/10) / ❌ REJECTED (≤6/10)

## Required Actions (if conditional/rejected)

- [ ] Action 1
- [ ] Action 2

## Next Review

YYYY-MM-DD
```

---

### Step 7: Approval Gate

**Score ≥ 8/10:**
- ✅ Approved for merge
- Log score in audit file
- Update baseline for future comparisons

**Score 7/10:**
- ⚠️ Conditional approval
- Document required fixes
- Re-review after fixes

**Score ≤ 6/10:**
- ❌ Rejected
- Cannot merge
- Redesign required
- New evaluation after redesign

---

## Automated Visual Testing (TODO)

### Playwright Integration

```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Capture screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  
  // Compare against baseline
  expect(screenshot).toMatchSnapshot('dashboard.png', {
    threshold: 0.1, // 10% tolerance
  });
});
```

### CI/CD Integration

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression
on: [pull_request]
jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:visual
      - uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: playwright-diffs/
```

---

## Score Appeal Process

If implementer disagrees with score:

1. **Request Review:** Tag Design Director with justification
2. **Provide Evidence:** Show why score should be different
3. **Second Opinion:** Optional third-party review
4. **Final Decision:** Design Director has final authority

**Appeal Format:**
```markdown
## Score Appeal

**Original Score:** X/10
**Requested Score:** Y/10
**Page:** [URL]
**Rationale:** [why score should change]
**Evidence:** [screenshots, references, etc.]
```

---

## Regression Detection

### Automated Detection

**Tools to implement:**
- Percy (visual regression SaaS)
- Chromatic (Storybook visual testing)
- Playwright screenshots (open source)

**Detection triggers:**
- Pixel differences > 5%
- Layout shifts
- Color changes
- Typography changes

### Manual Detection

**Check for:**
- Inconsistent spacing
- Color drift
- Typography hierarchy breaks
- Component variations
- Missing states

---

## Audit Schedule

| Type | Frequency | Scope |
|------|-----------|-------|
| Component audit | Per PR | Changed components only |
| Page audit | Weekly | All pages rotation |
| Full audit | Monthly | Entire application |
| Pre-release | Before deploy | Critical paths only |

---

## Historical Tracking

All scores logged in `/docs/design/visual-audits/`:

```
/docs/design/visual-audits/
├── 2026-03-03-dashboard.md
├── 2026-03-05-profile-page.md
├── 2026-03-10-settings.md
└── monthly-summary-2026-03.md
```

**Monthly Summary Format:**
```markdown
# Monthly Visual Audit Summary — March 2026

**Total Audits:** X
**Average Score:** X.X/10
**Approved:** X
**Conditional:** X
**Rejected:** X

**Trend:** 📈 Improving / 📉 Declining / ➡️ Stable

**Top Performers:**
1. [Page] — X/10
2. [Page] — X/10
3. [Page] — X/10

**Needs Attention:**
1. [Page] — X/10 — [issue]
2. [Page] — X/10 — [issue]
```

---

## Compliance

**UI changes without visual audit:**
- ❌ Cannot merge
- ❌ Count as incomplete work
- ⚠️ Design Director must be notified

**Repeated violations:**
- 1st: Warning
- 2nd: PR blocked
- 3rd: Team review required

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
