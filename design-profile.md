# Design Profile — Knowledge Graph Studio

**Status:** ✅ APPROVED  
**Created:** 2026-03-03  
**Design Director Approval:** AURELIUS / 2026-03-03  
**Project:** Knowledge Graph Studio

---

## Brand Personality

**Primary:** Analytical  
**Secondary:** Enterprise

**Rationale:**
> KGS is an internal admin tool for managing knowledge resources. Users are administrators and analysts who need clarity, precision, and efficiency. The interface should feel systematic and trustworthy, not playful or decorative.

---

## Tone

**Selected Tone:** Analytical

**Tone in Practice:**
> - Microcopy is direct and informative
> - Data is presented clearly with proper hierarchy
> - Interactions are predictable and consistent
> - No decorative animations or surprise elements
> - Error messages are specific and actionable

---

## Density Preference

**Selected Density:** Standard

**Implementation Notes:**
> - Card padding: `p-6` (24px)
> - Grid gaps: `gap-4` (16px)
> - Section margins: `mt-8` (32px)
> - Table row height: `py-3` (12px vertical)
> - Dashboard: 4-up KPI grid (information-dense but scannable)

---

## Theme Strategy

**Selected Strategy:** Equal

**Rationale:**
> KGS will be used throughout the day in varying lighting conditions. Both light and dark modes must be designed independently for optimal readability. Dark mode is not an afterthought—it's a first-class theme.

---

## Motion Philosophy

**Selected Motion Level:** Subtle

**Motion Principles:**
> - Motion indicates state change only (hover, focus, loading)
> - Page transitions are instant (no fade/slide)
> - Sidebar collapse/expand has smooth transition (300ms)
> - No decorative animations
> - Respects `prefers-reduced-motion`

---

## Competitive References

### Reference 1: Square UI Marketing Dashboard
**URL:** https://square-ui-marketing-dashboard.vercel.app/  
**What to emulate:**
- Clean card-based layout
- Dense data tables
- Consistent spacing rhythm
- Professional aesthetic

**What to avoid:**
- Top navigation bar (we're sidebar-first)
- Overly marketing-focused design

### Reference 2: Vercel Dashboard
**URL:** https://vercel.com/dashboard  
**What to emulate:**
- Sidebar navigation clarity
- Project card design
- Status indicators

**What to avoid:**
- Complexity (our use case is simpler)

### Reference 3: Linear
**URL:** https://linear.app  
**What to emulate:**
- Keyboard-first navigation
- Clean typography
- Subtle interactions

**What to avoid:**
- Dark-only (we need equal light/dark)

---

## Typography Style

**Selected Style:** Modern sans

**Font Stack:**
```
Primary: Inter, system-ui, sans-serif
Mono: JetBrains Mono, monospace (for IDs, code)
```

**Hierarchy:**
```
H1: text-2xl (24px) / bold (700) / line-height 2rem
H2: text-xl (20px) / semibold (600) / line-height 1.75rem
H3: text-lg (18px) / medium (500) / line-height 1.75rem
Body: text-base (16px) / normal (400) / line-height 1.5rem
Small: text-sm (14px) / normal (400) / line-height 1.25rem
Caption: text-xs (12px) / normal (400) / line-height 1rem
```

---

## Corner Radius Scale

**Selected Scale:** Moderate

**Application:**
| Element | Radius | Token |
|---------|--------|-------|
| Buttons | 6px | `radius-md` |
| Cards | 8px | `radius-lg` |
| Inputs | 6px | `radius-md` |
| Badges | 9999px | `radius-full` |
| Modals | 12px | `radius-xl` |

**Rationale:** Moderate radius feels professional without being cold. Sharp corners feel too enterprise; full rounds feel too playful.

---

## Depth System

**Selected Depth:** Layered

**Shadow Scale:**
```
Level 0: none (default surfaces)
Level 1: 0 1px 2px rgba(0,0,0,0.05) (hover)
Level 2: 0 4px 6px rgba(0,0,0,0.1) (cards, dropdowns)
Level 3: 0 10px 15px rgba(0,0,0,0.1) (modals)
```

**Dark Mode Adjustment:**
```
Level 1: 0 1px 2px rgba(0,0,0,0.3)
Level 2: 0 4px 6px rgba(0,0,0,0.4)
Level 3: 0 10px 15px rgba(0,0,0,0.5)
```

---

## Accent Strategy

**Selected Strategy:** Single accent + Functional

**Colors:**
- **Primary (Actions):** Indigo-600 / Indigo-500 (dark)
- **Success:** Green-600 / Green-500 (dark)
- **Warning:** Yellow-600 / Yellow-500 (dark)
- **Error:** Red-600 / Red-500 (dark)
- **Info:** Blue-600 / Blue-500 (dark)

**Usage Rules:**
> - Primary accent for CTAs and active states only
> - Functional colors for status (success/warning/error)
> - No decorative color usage
> - Neutral grays for everything else

---

## Sidebar Specification

**Type:** Fixed left sidebar  
**Width:** 256px (w-64)  
**Behavior:** Collapsible to icon rail  
**Toggle:** Inside sidebar header (X button)  
**Recovery:** Toggle always visible when collapsed

**Navigation Items:**
1. Dashboard (📊)
2. Browse (📚)
3. Search (🔍)
4. Ingest (📥)
5. Analytics (📈)

**Footer:**
- User profile link (👤)
- Theme toggle (🌙/☀️)

---

## Dashboard Layout

**Structure:**
```
┌─────────────────────────────────────────┐
│  [Optional Page Header with Title]      │
├─────────────────────────────────────────┤
│                                         │
│  [KPI Cards — 4-up grid]                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │Card │ │Card │ │Card │ │Card │       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│                                         │
│  [Quick Actions — horizontal row]       │
│  [Button] [Button] [Button]             │
│                                         │
│  [Recent Activity — data table]         │
│  ┌─────────────────────────────────┐   │
│  │ Header │ Header │ Header │      │   │
│  ├─────────────────────────────────┤   │
│  │ Row    │ Row    │ Row    │ ... │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Design Director Notes

**Approved with conditions:**
1. Ensure dark mode is designed independently (not inverted)
2. Table density must match Square UI reference
3. Add filter controls to data table (not just display)
4. Maintain analytical tone—no decorative elements

**Next Review:** After dashboard refactor (Phase E1 implementation)

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-03-03 | 1.0 | Initial profile | AURELIUS |

---

*Profile Version: 1.0*  
*KGS Design Governance System*
