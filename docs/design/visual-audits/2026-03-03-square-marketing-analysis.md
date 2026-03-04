# Visual Analysis — Square Marketing Dashboard

**Date:** 2026-03-03  
**Source:** Square Marketing (square.lndev.me)  
**Purpose:** Reference for KGS Dashboard redesign

---

## Visual Breakdown

### 1. Theme
- **Mode:** Dark-first (not dark mode toggle - this IS the primary theme)
- **Background:** Near-black (#0A0A0A or #0D0D0E)
- **Cards:** Slightly lighter (#121212 or #1A1A1B)
- **Borders:** Subtle (#27272A or #3F3F46 at low opacity)

### 2. Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Background | #0A0A0A | Page base |
| Card Surface | #121212 | Card backgrounds |
| Border | #27272A | Subtle dividers |
| Text Primary | #FAFAFA | Headlines, KPIs |
| Text Secondary | #A1A1AA | Labels, metadata |
| Text Muted | #71717A | Timestamps, hints |
| Accent Green | #10B981 | Positive trends, success |
| Accent Red | #EF4444 | Negative trends, errors |
| Status Live | #10B981 | Green pill |
| Status Paused | #F59E0B | Amber pill |
| Status Ended | #8B5CF6 | Purple pill |
| Status Draft | #6B7280 | Gray pill |

### 3. Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| KPI Value | 24-28px | 600-700 | #FAFAFA |
| KPI Label | 13px | 400 | #A1A1AA |
| Trend | 13px | 500 | #10B981 or #EF4444 |
| Table Header | 13px | 500 | #A1A1AA |
| Table Cell | 14px | 400 | #E4E4E7 |
| Sidebar Item | 14px | 400-500 | #E4E4E7 |
| Sidebar Active | 14px | 500 | #FAFAFA + bg highlight |

### 4. Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR (256px)  │  MAIN CONTENT                               │
│                  │                                             │
│ [Logo]           │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│                  │  │ KPI │ │ KPI │ │ KPI │ │ KPI │           │
│ Dashboard        │  └─────┘ └─────┘ └─────┘ └─────┘           │
│ Campaigns ●      │                                             │
│ Projects         │  ┌─────────────────┐ ┌─────────────────┐   │
│ Team             │  │   AREA CHART    │ │  RECENT UPLOADS │   │
│ Messages         │  │   (full width)  │ │  (card carousel)│   │
│ Wallet           │  └─────────────────┘ └─────────────────┘   │
│                  │                                             │
│ FOLDERS          │  ┌─────────────────────────────────────┐   │
│ [search] [+]     │  │ Search │ Filter │ Sort │ [+ New]   │   │
│                  │  ├─────────────────────────────────────┤   │
│ • Product launch │  │           DATA TABLE                │   │
│ • Personal brand │  │   (dense, many columns)             │   │
│ • Build in public│  │   - Status badges                   │   │
│ • Lunor design   │  │   - Progress bars                   │   │
│ • Day life vlogs │  │   - Pagination                      │   │
│ + New folder     │  └─────────────────────────────────────┘   │
│                  │                                             │
│ Help             │                                             │
│ Settings         │                                             │
│                  │                                             │
│ [Promo Card]     │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

### 5. Component Details

#### KPI Cards
- Background: Card surface (#121212)
- Border: 1px subtle (#27272A)
- Radius: 8px (rounded-lg)
- Padding: 20-24px
- Content: Label (muted), Value (large bold), Trend (colored with arrow)

#### Area Chart
- Full width section
- Green line (#10B981)
- Subtle grid lines
- Date labels on x-axis
- Value labels on y-axis
- "Last month" filter pill

#### Recent Uploads (Card Carousel)
- Horizontal scroll
- Card thumbnails with overlay
- View count badge
- Time badge ("2d ago")
- Radius: 8px

#### Data Table
- Dense rows (~48px height)
- Column headers with sort icons
- Status pills (Live/Paused/Ended/Draft)
- Platform icons (Instagram, TikTok, YouTube)
- Progress bars for budget
- Checkbox for row selection
- Pagination at bottom

### 6. Spacing

| Element | Spacing |
|---------|---------|
| KPI Grid Gap | 16px (gap-4) |
| Section Gap | 24px (mt-6) |
| Card Padding | 20-24px |
| Table Row | 48px height |
| Sidebar Item | 12px vertical padding |

### 7. Interactive States

| Element | Hover | Active |
|---------|-------|--------|
| Sidebar Item | bg=#27272A | bg=#3F3F46 |
| Table Row | bg=#1A1A1B | - |
| Button | bg=#27272A | bg=#3F3F46 |
| KPI Card | border brightens | - |

### 8. Motion

- Sidebar toggle: 200-250ms
- Hover states: 120-150ms
- Chart animations: 400-500ms (on load only)

---

## KGS Adaptation Plan

### What We'll Adopt

| Aspect | Square Implementation | KGS Adaptation |
|--------|----------------------|----------------|
| Theme | Dark-first | Dark mode option (Level 2 Professional) |
| KPI Layout | 4-up grid | ✅ Already have, will refine |
| KPI Style | Large value, trend indicator | ✅ Will add trend arrows |
| Chart | Area chart | Will add with recharts |
| Table | Dense, many columns | Will increase density |
| Status Badges | Colored pills | ✅ Have, will match colors |
| Sidebar | Dark, icons+labels | ✅ Similar, will refine spacing |
| Borders | Subtle 1px | ✅ Will match |
| Typography | Inter, clear hierarchy | ✅ Already using Inter |

### What We Won't Adopt

| Aspect | Reason |
|--------|--------|
| Dark-first | KGS is Level 2 Professional (light-first, dark option) |
| Image carousel | Not relevant for knowledge resources |
| Creator avatars | Not relevant for our use case |
| Platform icons | We don't have social platforms |

---

## Implementation Priority

### Phase 1 (Immediate)
- [ ] Dark mode color tokens
- [ ] KPI card refinement (trend indicators)
- [ ] Table density increase
- [ ] Status badge color update

### Phase 2 (Next Iteration)
- [ ] Area chart integration (recharts)
- [ ] Filter/Sort controls
- [ ] Progress bars in table
- [ ] Pagination component

### Phase 3 (Future)
- [ ] Row selection checkboxes
- [ ] Bulk actions
- [ ] Export functionality

---

*Analysis Complete — Ready for Implementation*
