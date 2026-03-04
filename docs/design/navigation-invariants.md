# Navigation Invariants

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Compliance:** MANDATORY

---

## Definition

Navigation invariants are UI behaviors that MUST always be true, regardless of page state, user action, or screen size.

**Principle:** Users must never be trapped. Navigation is a right, not a feature.

---

## Invariant Rules

### Invariant 1: Navigation Always Recoverable

**Rule:** From any page state, primary navigation must be accessible within 1 interaction.

**Compliance:**
- ✅ Sidebar with persistent toggle
- ✅ Breadcrumb trail on deep pages
- ✅ "Back to Dashboard" links
- ❌ Full-screen modals without escape
- ❌ Pages that hide all navigation

**Enforcement:** Design Director review + automated testing

---

### Invariant 2: Sidebar Close ≠ Navigation Loss

**Rule:** Closing sidebar MUST expose an obvious recovery mechanism.

**Required Implementations (choose one):**

#### Option A: Collapsed Icon Rail
```tsx
// Sidebar collapsed state shows icon-only rail
<aside className="w-16">
  {navItems.map(item => (
    <IconButton icon={item.icon} tooltip={item.label} />
  ))}
</aside>
```

#### Option B: Persistent Toggle Button
```tsx
// Fixed toggle always visible when sidebar closed
<button className="fixed left-2 top-2">
  <MenuIcon />
</button>
```

#### Option C: Top Bar Recovery
```tsx
// Header bar with menu button (mobile pattern)
<header>
  <button onClick={openSidebar}>
    <MenuIcon />
  </button>
</header>
```

**Forbidden:**
- ❌ Sidebar closes with no visible toggle
- ❌ Toggle hidden off-screen
- ❌ Keyboard-only recovery (mouse users trapped)
- ❌ Browser back button as only recovery

---

### Invariant 3: No UI State Removes Primary Navigation

**Rule:** Loading states, error states, and empty states must preserve navigation access.

**Compliance:**
- ✅ Sidebar visible during loading
- ✅ Error pages include navigation
- ✅ Empty states show nav
- ❌ Full-screen loading spinners (no nav visible)
- ❌ Error pages with only "retry" button

**Exception:** Authentication flows (login/register) may hide app navigation.

---

### Invariant 4: Theme Toggle Always Accessible

**Rule:** Users must be able to change theme from any page without navigation.

**Required:**
- Theme toggle in persistent UI element (sidebar, header)
- Accessible via keyboard (Tab + Enter)
- Visible in both light and dark modes
- Maximum 2 interactions from any state

**Placement Options:**
- Sidebar footer (current KGS implementation)
- Top header bar
- User menu dropdown

**Forbidden:**
- ❌ Theme toggle only in settings page
- ❌ Hidden behind multiple menus
- ❌ Keyboard-inaccessible

---

### Invariant 5: Page Must Never Trap User

**Rule:** No page state may prevent user from leaving or navigating elsewhere.

**Compliance:**
- ✅ All interactive elements can be exited
- ✅ Modals have close buttons
- ✅ Full-screen states have escape
- ✅ Forms can be cancelled
- ❌ Confirmation dialogs without "cancel"
- ❌ Auto-redirecting pages without pause

**Modal Requirements:**
```tsx
// All modals must have:
<Modal>
  <ModalContent />
  <ModalCloseButton />  // ✅ Required
  <ModalCancelButton /> // ✅ Required for actions
</Modal>
```

---

## Implementation Checklist

### Sidebar Component
- [ ] Toggle button visible when closed
- [ ] Toggle has aria-label
- [ ] Sidebar can be opened via keyboard
- [ ] Focus trapped appropriately when open
- [ ] Escape key closes sidebar

### Mobile Navigation
- [ ] Hamburger menu visible
- [ ] Menu can be dismissed
- [ ] Overlay closes on outside click
- [ ] Navigation items large enough for touch

### Error States
- [ ] 404 page includes navigation
- [ ] Error boundaries preserve nav
- [ ] "Go back" or "Home" link present

### Loading States
- [ ] Skeleton screens show nav structure
- [ ] Loading spinners don't block nav
- [ ] Progressive loading (nav first)

---

## Lint Rule Specification

### ESLint Plugin (TODO)

```js
// eslint-plugin-kgs-design
module.exports = {
  rules: {
    'navigation-invariant-toggle': {
      description: 'Sidebar must have visible toggle when closed',
      check: (ast) => {
        // Verify toggle button exists in sidebar component
      }
    },
    'navigation-invariant-escape': {
      description: 'Modals must have escape mechanism',
      check: (ast) => {
        // Verify modal has close button
      }
    },
    'theme-toggle-accessible': {
      description: 'Theme toggle must be accessible',
      check: (ast) => {
        // Verify theme toggle exists and is accessible
      }
    }
  }
}
```

---

## Violation Reporting

### Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| P0 | Navigation trap | Immediate fix required |
| P1 | Toggle hidden | Fix before merge |
| P2 | Theme toggle hard to find | Fix within sprint |
| P3 | Minor accessibility | Document, fix when able |

### Reporting Format

```markdown
## Navigation Invariant Violation

**Severity:** P1
**Page:** /dashboard
**Issue:** Sidebar toggle hidden when collapsed
**Impact:** Users cannot recover navigation
**Fix:** Add persistent toggle button
**Deadline:** Before merge
```

---

## Testing Protocol

### Manual Testing

1. **Sidebar Recovery Test**
   - Open page
   - Close sidebar
   - Verify toggle visible
   - Open sidebar via toggle
   - Repeat 3x

2. **Theme Toggle Test**
   - Navigate to random page
   - Find theme toggle
   - Count interactions needed
   - Must be ≤ 2

3. **Modal Escape Test**
   - Open modal
   - Try to close without completing action
   - Must have cancel/close option

4. **Keyboard Navigation Test**
   - Tab through all elements
   - Verify focus visible
   - Escape closes overlays
   - Enter activates buttons

### Automated Testing (TODO)

```js
// Playwright test
test('navigation invariant: sidebar recovery', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[aria-label="Close sidebar"]');
  await expect(page.locator('[aria-label="Open sidebar"]')).toBeVisible();
});
```

---

## Compliance Certification

**Project:** _________________  
**Reviewed by:** _________________  
**Date:** _________________  

### Checklist

- [ ] Invariant 1: Navigation recoverable
- [ ] Invariant 2: Sidebar close has recovery
- [ ] Invariant 3: No nav removal in UI states
- [ ] Invariant 4: Theme toggle accessible
- [ ] Invariant 5: No user trapping

**Decision:** ✅ COMPLIANT / ❌ NON-COMPLIANT

**Violations Found:**
- [ ] None
- [ ] P0: _________
- [ ] P1: _________
- [ ] P2: _________
- [ ] P3: _________

**Next Audit:** _________________

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
