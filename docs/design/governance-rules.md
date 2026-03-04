# Design Governance Rules

**Version:** 1.2  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Rule 0: Required Documents Before UI Work

**Before any UI design or styling, system must load:**

1. `hard-constraints.md` — Depth/spacing/accent/motion rules
2. `emotional-layer.md` — Emotional intensity declaration
3. `typography-authority.md` — Typography system
4. `motion-framework.md` — Motion categories and intensity
5. `visual-hierarchy.md` — Attention model and budget
6. `personality-matrix.md` — Design archetype
7. `design-profile.md` — Project-specific identity

**Enforcement:**
- Missing any document → ❌ Styling blocked
- PR without document references → ❌ Auto-rejected
- Design without loaded context → ❌ Redesign required

### Required Documentation Block

Every design PR must include:

```markdown
## Design Context Loaded

- [ ] hard-constraints.md
- [ ] emotional-layer.md
- [ ] typography-authority.md
- [ ] motion-framework.md
- [ ] visual-hierarchy.md
- [ ] personality-matrix.md
- [ ] design-profile.md

## Archetype

**Selected:** [Archetype Name]

## Emotional Intensity

**Level:** X — [Name]

## Motion Intensity

**Level:** X — [Name]
```

---

## Rule 1: Philosophy First

**No UI work begins without approved design philosophy.**

### Enforcement
- PR without `design-profile.md` → ❌ Auto-rejected
- Component without philosophy reference → ❌ Auto-rejected
- Style change without rationale → ❌ Auto-rejected

### Required Documentation
```markdown
## Design Philosophy Reference

**Project:** [name]
**Profile:** /projects/[name]/design-profile.md
**Relevant Sections:**
- Brand Personality: [section]
- Density: [section]
- Theme Strategy: [section]
```

---

## Rule 2: Token Reference Required

**No ad-hoc values. All styling must reference tokens.**

### Forbidden
```tsx
// ❌ REJECTED
className="p-[13px] m-[17px] rounded-[7px]"
```

### Required
```tsx
// ✅ APPROVED
className="p-3 m-4 rounded-md"
```

### Exception Process
If token doesn't exist:
1. Propose new token in `/docs/design/token-architecture.md`
2. Design Director approval
3. Add to token system
4. Use new token

---

## Rule 3: Invariant Validation

**Navigation invariants must be validated before merge.**

### Checklist (must complete)
- [ ] Navigation recoverable from all states
- [ ] Sidebar toggle visible when closed
- [ ] Theme toggle accessible
- [ ] No user trapping
- [ ] Mobile responsive

### Automated Check (TODO)
```bash
pnpm check:invariants
```

---

## Rule 4: Design Score Minimum

**No UI approved below threshold.**

| Project Type | Minimum Score |
|--------------|---------------|
| Dashboards | 8.5/10 |
| Marketing Sites | 9.0/10 |
| Wedding Sites | 9.5/10 |
| E-commerce | 9.0/10 |
| SaaS Products | 8.5/10 |

### Scoring Process
1. Design Director evaluates
2. Score logged in `/docs/design/visual-audits/`
3. Score < threshold → revision required
4. Score ≥ threshold → approved for merge

### Score Log Format
```markdown
## Visual Audit — [Page]

**Date:** YYYY-MM-DD
**Score:** X/10
**Decision:** ✅/⚠️/❌
**Log:** /docs/design/visual-audits/YYYY-MM-DD.md
```

---

## Rule 5: Documentation Required

**No UI change without documentation update.**

### Required Updates
| Change Type | Documentation |
|-------------|---------------|
| New component | Component docs + token reference |
| Style change | Visual audit log |
| Token addition | Token architecture doc |
| Philosophy change | Design profile revision |
| Iteration | Delta log entry |

---

## Rule 6: Hard Constraints Validation

**All hard constraints must pass before merge.**

### Constraint Checklist
- [ ] Depth: 4-level system followed
- [ ] Spacing: Scale enforced (no arbitrary values)
- [ ] Accent: Single color, ≤10% viewport
- [ ] Motion: Tiers followed (120/180/240ms)

### Violation = Auto-Reject
- Depth Level 4+ → ❌ Reject
- Arbitrary spacing → ❌ Reject
- Rainbow UI → ❌ Reject
- Spring animations → ❌ Reject

---

## Rule 7: Dual-Phase Workflow

**Design and implementation are separate phases.**

### Phase A (Design)
- Actor: Design Director only
- Output: Layout plan + token map + depth map + motion plan
- Rule: NO CODE WRITTEN

### Phase B (Implementation)
- Actor: Frontend only
- Input: Approved Design Plan
- Rule: NO DESIGN DECISIONS

### Phase Overlap = Reject
- Designer writes code in Phase A → ❌ Reject
- Developer makes design decisions in Phase B → ❌ Reject

---

## Rule 8: Delta Log Required

**No iteration without delta log entry.**

### Required Fields
- What changed?
- Why?
- Token impact
- Spacing tier impact
- Depth level impact
- Score impact (before/after)
- Lessons learned

### No Delta Log = No Completion
- PR without delta log → ❌ Blocked
- Iteration undocumented → ⚠️ Warning

---

## Violation Consequences

| Violation | First | Second | Third |
|-----------|-------|--------|-------|
| No philosophy | Warning | PR blocked | Team review |
| Ad-hoc values | Fix required | PR blocked | Design review |
| Invariant breach | Immediate fix | PR blocked | Incident report |
| Score < threshold | Revision | Design Director consult | Redesign |
| Constraint violation | Fix required | PR blocked | Redesign |
| Phase overlap | Warning | PR blocked | Process review |
| No delta log | Warning | PR blocked | Documentation review |

---

## Approval Workflow

```
┌─────────────────┐
│  UI Change      │
│  Proposed       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Philosophy     │
│  Reference?     │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Token          │
│  Reference?     │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Invariant      │
│  Validation?    │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Hard           │
│  Constraints?   │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Design         │
│  Director Score │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  ≥Threshold <Threshold
    │         │
    ▼         ▼
  ✅       ❌ Revise
  Merge
```

---

## Audit Schedule

| Audit Type | Frequency | Scope | Owner |
|------------|-----------|-------|-------|
| Component | Per PR | Changed components | Design Director |
| Page | Weekly | Rotating pages | Design Director |
| Full | Monthly | Entire app | Design Director |
| Pre-release | Before deploy | Critical paths | Design Director |
| Constraint | Per PR | Hard constraints | Design Director |

---

## Exemptions

**Emergency fixes** may bypass governance with:
1. CTO approval
2. Post-fix review within 48h
3. Incident report filed

**Prototype/experimental** features may use relaxed governance with:
1. `[EXPERIMENTAL]` tag in PR
2. Not for production
3. Full governance before production merge

---

## Governance Review

This governance system is reviewed quarterly:
- Effectiveness assessment
- Rule adjustments
- Process improvements

**Next Review:** 2026-06-03

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*

---

## Rule 2: Token Reference Required

**No ad-hoc values. All styling must reference tokens.**

### Forbidden
```tsx
// ❌ REJECTED
className="p-[13px] m-[17px] rounded-[7px]"
```

### Required
```tsx
// ✅ APPROVED
className="p-3 m-4 rounded-md"
```

### Exception Process
If token doesn't exist:
1. Propose new token in `/docs/design/token-architecture.md`
2. Design Director approval
3. Add to token system
4. Use new token

---

## Rule 3: Invariant Validation

**Navigation invariants must be validated before merge.**

### Checklist (must complete)
- [ ] Navigation recoverable from all states
- [ ] Sidebar toggle visible when closed
- [ ] Theme toggle accessible
- [ ] No user trapping
- [ ] Mobile responsive

### Automated Check (TODO)
```bash
pnpm check:invariants
```

---

## Rule 4: Design Score Minimum

**No UI approved below 8/10.**

### Scoring Process
1. Design Director evaluates
2. Score logged in `/docs/design/visual-audits/`
3. Score < 8 → revision required
4. Score ≥ 8 → approved for merge

### Score Log Format
```markdown
## Visual Audit — [Page]

**Date:** YYYY-MM-DD
**Score:** X/10
**Decision:** ✅/⚠️/❌
**Log:** /docs/design/visual-audits/YYYY-MM-DD.md
```

---

## Rule 5: Documentation Required

**No UI change without documentation update.**

### Required Updates
| Change Type | Documentation |
|-------------|---------------|
| New component | Component docs + token reference |
| Style change | Visual audit log |
| Token addition | Token architecture doc |
| Philosophy change | Design profile revision |

---

## Violation Consequences

| Violation | First | Second | Third |
|-----------|-------|--------|-------|
| No philosophy | Warning | PR blocked | Team review |
| Ad-hoc values | Fix required | PR blocked | Design review |
| Invariant breach | Immediate fix | PR blocked | Incident report |
| Score < 8 | Revision | Design Director consult | Redesign |

---

## Approval Workflow

```
┌─────────────────┐
│  UI Change      │
│  Proposed       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Philosophy     │
│  Reference?     │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Token          │
│  Reference?     │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Invariant      │
│  Validation?    │─── No ───► ❌ Reject
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Design         │
│  Director Score │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  ≥8/10     <8/10
    │         │
    ▼         ▼
  ✅       ❌ Revise
  Merge
```

---

## Audit Schedule

| Audit Type | Frequency | Scope | Owner |
|------------|-----------|-------|-------|
| Component | Per PR | Changed components | Design Director |
| Page | Weekly | Rotating pages | Design Director |
| Full | Monthly | Entire app | Design Director |
| Pre-release | Before deploy | Critical paths | Design Director |

---

## Exemptions

**Emergency fixes** may bypass governance with:
1. CTO approval
2. Post-fix review within 48h
3. Incident report filed

**Prototype/experimental** features may use relaxed governance with:
1. `[EXPERIMENTAL]` tag in PR
2. Not for production
3. Full governance before production merge

---

## Governance Review

This governance system is reviewed quarterly:
- Effectiveness assessment
- Rule adjustments
- Process improvements

**Next Review:** 2026-06-03

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
