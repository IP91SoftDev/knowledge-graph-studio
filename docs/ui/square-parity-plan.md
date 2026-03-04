# Square UI Parity Plan

**Date:** 2026-03-03  
**Target:** https://square-ui-marketing-dashboard.vercel.app/  
**Snapshot:** `docs/snapshots/2026-03-03T17-12-33-534Z-a5d3fb49/`

---

## Executive Summary

Square UI Marketing Dashboard uses:
- **Layout:** Sidebar-first with top header bar
- **Framework:** Next.js + shadcn/ui + Tailwind CSS
- **Theme:** Dark mode with class-based toggling
- **Components:** Cards, tables, buttons, badges (all shadcn/ui)

**Our Status:**
- ✅ Sidebar-first layout (matching)
- ✅ Dark mode implemented (next-themes)
- ⏳ Card styling needs refinement
- ⏳ Table density needs update
- ⏳ Filter/search controls needed

---

## Layout Structure Analysis

### Square UI Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Top Header Bar (h-16)                                      │
│  [Hamburger] [Title]              [Theme Toggle] [Profile]  │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  Sidebar │              Main Content                        │
│  (w-64)  │                                                  │
│          │  ┌─────────────────────────────────────────┐    │
│  Nav     │  │  KPI Cards Grid (4-up)                  │    │
│  Items   │  └─────────────────────────────────────────┘    │
│          │                                                  │
│          │  ┌─────────────────────────────────────────┐    │
│          │  │  Data Table with Filters                │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Our Current Structure

```
┌──────────┬──────────────────────────────────────────────────┐
│          │                                                  │
│  Sidebar │  [Toggle Button - FIXED inside sidebar]          │
│  (w-64)  │                                                  │
│          │  ┌─────────────────────────────────────────┐    │
│  [X] Btn │  │  Page Header (optional)                 │    │
│  KGS     │  └─────────────────────────────────────────┘    │
│          │                                                  │
│  Nav     │  ┌─────────────────────────────────────────┐    │
│  Items   │  │  KPI Cards Grid (4-up)                  │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                  │
│  👤 ⚙️   │  ┌─────────────────────────────────────────┐    │
│          │  │  Recent Activity (list, not table)      │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Key Differences

| Aspect | Square UI | Our Implementation | Action |
|--------|-----------|-------------------|--------|
| Toggle position | Top header bar | Inside sidebar header | ✅ Fixed |
| Top header bar | Yes (with title) | No (sidebar-only) | Keep ours |
| KPI grid | 4-up with icons | 4-up basic | Enhance styling |
| Data table | Dense with filters | Simple list | Add table + filters |
| Theme toggle | Top-right | Sidebar footer | OK (accessible) |

---

## Component Inventory

### From Square UI Snapshot

| Component | Count | Our Status | Gap |
|-----------|-------|------------|-----|
| Cards | 9 | ✅ Have | Style refinement needed |
| Tables | 1 | ⏳ Partial | Need dense table + filters |
| Buttons | 33 | ✅ Have | Style matching |
| Badges | 4 | ⏳ Missing | Need to add |
| Inputs | 1 | ✅ Have | OK |

### Components to Create/Update

| Component | File | Status | Priority |
|-----------|------|--------|----------|
| `Badge` | `@repo/ui` | ⏳ TODO | High |
| `DataTable` | `apps/web/components/ui/` | ⏳ TODO | High |
| `FilterBar` | `apps/web/components/ui/` | ⏳ TODO | High |
| `StatCard` (enhanced) | `apps/web/components/ui/` | ⏳ TODO | Medium |

---

## Spacing Rhythm + Typography

### Square UI Spacing (from analysis)

**Most Common Classes:**
- `p-2` (8px) — Tight internal spacing
- `py-3` (12px) — Vertical padding
- `gap-2` (8px) — Standard gaps
- `px-3` (12px) — Horizontal padding
- `p-6` (24px) — Card padding

### Our Current Spacing

**Dashboard.tsx:**
- Card padding: `p-6` ✅ (matches)
- Grid gap: `gap-4` (16px) — Square uses `gap-2` (8px)
- Section margin: `mt-8` (32px) ✅

### Typography Scale

**Square UI:**
- H1: `text-2xl font-bold` (24px)
- H2: `text-lg font-semibold` (18px)
- Body: `text-sm` (14px)
- Small: `text-xs` (12px)

**Our Implementation:** ✅ Matching

---

## Theme Approach

### Square UI Implementation

**Detection from HTML:**
- Uses `class` strategy for dark mode
- `dark:` prefix variants throughout
- Theme toggle with sun/moon icons
- Animated transitions

**Classes Found:**
```tsx
hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
text-emerald-600 dark:text-emerald-400
bg-primary text-primary-foreground hover:bg-primary/90
```

### Our Implementation

**Status:** ✅ Implemented
- next-themes with `attribute="class"`
- ThemeToggle component in sidebar footer
- Dark mode variants in AppShell

**Gap:** Need to add `dark:` variants to Dashboard cards

---

## Implementation Mapping

### Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `apps/web/components/ui/Badge.tsx` | Status badges/chips | High |
| `apps/web/components/ui/DataTable.tsx` | Dense data table | High |
| `apps/web/components/ui/FilterBar.tsx` | Search + filters | High |
| `apps/web/components/ui/StatCard.tsx` | Enhanced KPI card | Medium |

### Files to Update

| File | Changes | Priority |
|------|---------|----------|
| `apps/web/components/dashboard/Dashboard.tsx` | Replace list with table, add filters | High |
| `apps/web/components/layout/AppShell.tsx` | Add dark mode variants | Medium |
| `apps/web/app/page.tsx` | Use enhanced StatCard | Medium |

---

## Implementation Plan

### Phase 1: Badge Component (30 min)
```bash
# Create Badge component
cat > apps/web/components/ui/Badge.tsx << 'EOF'
// shadcn/ui Badge implementation
EOF
```

### Phase 2: DataTable Component (1 hour)
```bash
# Create dense table with sorting
cat > apps/web/components/ui/DataTable.tsx << 'EOF'
// Table with TanStack Table integration
EOF
```

### Phase 3: FilterBar Component (30 min)
```bash
# Create filter/search bar
cat > apps/web/components/ui/FilterBar.tsx << 'EOF'
// Search input + filter dropdowns
EOF
```

### Phase 4: Dashboard Refactor (1 hour)
```bash
# Update Dashboard.tsx
- Replace recent activity list with DataTable
- Add FilterBar above table
- Update StatCard styling
- Add dark mode variants
```

### Phase 5: Dark Mode Polish (30 min)
```bash
# Add dark: variants to all components
- Cards: dark:bg-gray-900 dark:border-gray-800
- Text: dark:text-gray-100
- Borders: dark:border-gray-800
```

---

## Acceptance Criteria

### Layout
- [ ] Toggle button inside sidebar header (not overlapping)
- [ ] Brand (KGS) always visible
- [ ] Sidebar collapsible
- [ ] Mobile responsive

### Dashboard
- [ ] 4-up KPI grid with proper spacing (gap-4)
- [ ] Cards match Square UI styling (borders, shadows)
- [ ] Recent activity as dense table (not list)
- [ ] Filter/search control above table
- [ ] Status badges in table

### Theme
- [ ] Dark mode toggle accessible
- [ ] All components have `dark:` variants
- [ ] No flash-of-unstyled-theme
- [ ] Theme persists in localStorage

---

## Screenshot Comparison

### Square UI Reference
- Location: `docs/snapshots/2026-03-03T17-12-33-534Z-a5d3fb49/screenshot.png`
- Key features: 4-up KPI cards, dense table, filter bar

### Our Current
- Location: Will update after implementation
- Target: Match Square UI density and spacing

---

*Last updated: 2026-03-03*  
*Next: Implement components per plan*
