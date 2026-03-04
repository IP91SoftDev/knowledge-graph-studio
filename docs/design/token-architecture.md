# Design Token Architecture

**Version:** 1.0  
**Status:** ✅ ACTIVE  
**Authority:** Design Director Agent  
**Scope:** All KGS Projects

---

## Overview

Design tokens are the atomic units of visual design. They encode design decisions as named values that can be consumed by any platform.

**Principle:** Tokens are global. Themes are local. Projects override values, not structure.

---

## Token Categories

### 1. Spacing Scale

**Base:** 4px (0.25rem)

```json
{
  "space": {
    "xs": { "value": "0.25rem", "comment": "4px - Tight gaps" },
    "sm": { "value": "0.5rem", "comment": "8px - Internal spacing" },
    "md": { "value": "1rem", "comment": "16px - Standard padding" },
    "lg": { "value": "1.5rem", "comment": "24px - Section spacing" },
    "xl": { "value": "2rem", "comment": "32px - Large gaps" },
    "2xl": { "value": "4rem", "comment": "64px - Page sections" }
  }
}
```

**Usage Rules:**
- Never use ad-hoc values (`p-[13px]` ❌)
- Always reference tokens (`p-3` ✅)
- Gaps between related items: `space-sm` or `space-md`
- Section margins: `space-lg` or `space-xl`

---

### 2. Radius Scale

```json
{
  "radius": {
    "none": { "value": "0", "comment": "Sharp corners" },
    "sm": { "value": "0.25rem", "comment": "4px - Subtle" },
    "md": { "value": "0.5rem", "comment": "8px - Standard" },
    "lg": { "value": "0.75rem", "comment": "12px - Friendly" },
    "xl": { "value": "1rem", "comment": "16px - Modern" },
    "full": { "value": "9999px", "comment": "Pills, avatars" }
  }
}
```

**Application Mapping:**
| Element | Token |
|---------|-------|
| Buttons | `radius-md` |
| Cards | `radius-lg` |
| Inputs | `radius-md` |
| Badges | `radius-full` |
| Modals | `radius-xl` |

---

### 3. Shadow Scale

```json
{
  "shadow": {
    "none": { "value": "none", "comment": "Flat" },
    "sm": { 
      "value": "0 1px 2px rgba(0,0,0,0.05)",
      "comment": "Subtle elevation"
    },
    "md": { 
      "value": "0 4px 6px rgba(0,0,0,0.1)",
      "comment": "Cards, dropdowns"
    },
    "lg": { 
      "value": "0 10px 15px rgba(0,0,0,0.1)",
      "comment": "Modals, floating panels"
    },
    "xl": { 
      "value": "0 20px 25px rgba(0,0,0,0.15)",
      "comment": "Maximum elevation"
    }
  }
}
```

**Dark Mode Adjustment:**
```json
{
  "shadow.dark": {
    "sm": "0 1px 2px rgba(0,0,0,0.3)",
    "md": "0 4px 6px rgba(0,0,0,0.4)",
    "lg": "0 10px 15px rgba(0,0,0,0.5)"
  }
}
```

---

### 4. Typography Scale

```json
{
  "typography": {
    "fontFamily": {
      "base": { "value": "Inter, system-ui, sans-serif" },
      "mono": { "value": "JetBrains Mono, monospace" }
    },
    "fontSize": {
      "xs": { "value": "0.75rem", "lineHeight": "1rem" },
      "sm": { "value": "0.875rem", "lineHeight": "1.25rem" },
      "base": { "value": "1rem", "lineHeight": "1.5rem" },
      "lg": { "value": "1.125rem", "lineHeight": "1.75rem" },
      "xl": { "value": "1.25rem", "lineHeight": "1.75rem" },
      "2xl": { "value": "1.5rem", "lineHeight": "2rem" },
      "3xl": { "value": "1.875rem", "lineHeight": "2.25rem" }
    },
    "fontWeight": {
      "normal": { "value": "400" },
      "medium": { "value": "500" },
      "semibold": { "value": "600" },
      "bold": { "value": "700" }
    }
  }
}
```

**Hierarchy Mapping:**
| Element | Size | Weight |
|---------|------|--------|
| H1 | `text-2xl` | `bold` |
| H2 | `text-xl` | `semibold` |
| H3 | `text-lg` | `medium` |
| Body | `text-base` | `normal` |
| Small | `text-sm` | `normal` |
| Caption | `text-xs` | `normal` |

---

### 5. Color Scale

### Neutral Palette

```json
{
  "color": {
    "neutral": {
      "50": { "value": "#fafafa" },
      "100": { "value": "#f4f4f5" },
      "200": { "value": "#e4e4e7" },
      "300": { "value": "#d4d4d8" },
      "400": { "value": "#a1a1aa" },
      "500": { "value": "#71717a" },
      "600": { "value": "#52525b" },
      "700": { "value": "#3f3f46" },
      "800": { "value": "#27272a" },
      "900": { "value": "#18181b" },
      "950": { "value": "#09090b" }
    }
  }
}
```

### Semantic Tokens

```json
{
  "color": {
    "background": {
      "light": { "value": "{color.neutral.50}" },
      "dark": { "value": "{color.neutral.950}" }
    },
    "foreground": {
      "light": { "value": "{color.neutral.900}" },
      "dark": { "value": "{color.neutral.50}" }
    },
    "card": {
      "light": { "value": "#ffffff" },
      "dark": { "value": "{color.neutral.900}" }
    },
    "border": {
      "light": { "value": "{color.neutral.200}" },
      "dark": { "value": "{color.neutral.800}" }
    },
    "muted": {
      "light": { "value": "{color.neutral.100}" },
      "dark": { "value": "{color.neutral.800}" }
    },
    "accent": {
      "light": { "value": "{color.neutral.100}" },
      "dark": { "value": "{color.neutral.800}" }
    }
  }
}
```

### Accent Colors (Project-Override)

```json
{
  "color": {
    "primary": {
      "light": { "value": "#4f46e5", "comment": "Indigo-600" },
      "dark": { "value": "#6366f1", "comment": "Indigo-500" }
    },
    "success": {
      "light": { "value": "#16a34a", "comment": "Green-600" },
      "dark": { "value": "#22c55e", "comment": "Green-500" }
    },
    "warning": {
      "light": { "value": "#ca8a04", "comment": "Yellow-600" },
      "dark": { "value": "#eab308", "comment": "Yellow-500" }
    },
    "error": {
      "light": { "value": "#dc2626", "comment": "Red-600" },
      "dark": { "value": "#ef4444", "comment": "Red-500" }
    }
  }
}
```

---

### 6. Surface Tiers

```json
{
  "surface": {
    "base": {
      "light": { "value": "#ffffff" },
      "dark": { "value": "#09090b" },
      "comment": "Page background"
    },
    "raised": {
      "light": { "value": "#ffffff" },
      "dark": { "value": "#18181b" },
      "comment": "Cards, panels"
    },
    "overlay": {
      "light": { "value": "#ffffff" },
      "dark": { "value": "#27272a" },
      "comment": "Modals, dialogs"
    },
    "floating": {
      "light": { "value": "#ffffff" },
      "dark": { "value": "#3f3f46" },
      "comment": "Dropdowns, popovers"
    }
  }
}
```

---

### 7. Border System

```json
{
  "border": {
    "width": {
      "none": { "value": "0" },
      "thin": { "value": "1px" },
      "thick": { "value": "2px" }
    },
    "style": {
      "solid": { "value": "solid" },
      "dashed": { "value": "dashed" },
      "dotted": { "value": "dotted" }
    },
    "color": {
      "default": {
        "light": { "value": "{color.neutral.200}" },
        "dark": { "value": "{color.neutral.800}" }
      },
      "strong": {
        "light": { "value": "{color.neutral.300}" },
        "dark": { "value": "{color.neutral.700}" }
      },
      "subtle": {
        "light": { "value": "{color.neutral.100}" },
        "dark": { "value": "{color.neutral.900}" }
      }
    }
  }
}
```

---

### 8. Elevation Mapping

```json
{
  "elevation": {
    "0": {
      "shadow": "{shadow.none}",
      "comment": "Default surface"
    },
    "1": {
      "shadow": "{shadow.sm}",
      "comment": "Hover, slight raise"
    },
    "2": {
      "shadow": "{shadow.md}",
      "comment": "Cards, dropdowns"
    },
    "3": {
      "shadow": "{shadow.lg}",
      "comment": "Modals, floating panels"
    },
    "4": {
      "shadow": "{shadow.xl}",
      "comment": "Maximum elevation"
    }
  }
}
```

---

### 9. Dark Mode Mapping

**Principle:** Dark mode is NOT inverted light mode. It requires independent design.

```json
{
  "darkMode": {
    "backgroundAdjustment": {
      "value": "+5%",
      "comment": "Dark backgrounds should be slightly lighter than pure black"
    },
    "shadowOpacity": {
      "value": "+30%",
      "comment": "Shadows need more opacity in dark mode"
    },
    "borderTransparency": {
      "value": "50%",
      "comment": "Borders should be subtle, use transparency"
    },
    "accentBrightness": {
      "value": "+10%",
      "comment": "Accents should be slightly brighter in dark mode"
    },
    "textContrast": {
      "value": "maintain",
      "comment": "Never reduce text contrast in dark mode"
    }
  }
}
```

---

## Project Override Structure

Projects can override token VALUES but not STRUCTURE:

```json
{
  "project": "knowledge-graph-studio",
  "overrides": {
    "color.primary": {
      "light": "#4f46e5",
      "dark": "#6366f1"
    },
    "radius": "md",
    "density": "standard"
  }
}
```

**Forbidden Overrides:**
- Token names (structure is immutable)
- Required categories (spacing, color, typography must exist)
- Accessibility thresholds (contrast ratios cannot be reduced)

---

## Token Files Location

```
/packages/design-tokens/
├── tokens.json          # Master token definitions
├── themes/
│   ├── light.json       # Light mode values
│   └── dark.json        # Dark mode values
└── projects/
    ├── knowledge-graph-studio.json
    └── [project].json
```

---

## Enforcement

### ESLint Rule (TODO)
```js
// Disallow ad-hoc values
'no-ad-hoc-spacing': 'error',
'require-token-usage': 'error'
```

### Design Director Review
- All new components must use tokens
- Token violations = automatic rejection
- Score impact: -2 points per violation

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
