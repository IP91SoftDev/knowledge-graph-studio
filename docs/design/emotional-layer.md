# Emotional Design Layer

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

Design is not just functional. It is emotional. Every design decision communicates feeling.

**Principle:** Emotion is designed, not accidental.

---

## 1. Emotional Intensity Scale (1–5)

Every project must declare its emotional intensity level. This affects all downstream decisions.

| Level | Name | Description | Use Cases |
|-------|------|-------------|-----------|
| 1 | Clinical | Neutral, sterile, data-focused | Medical dashboards, legal tools, financial terminals |
| 2 | Professional | Restrained, business-like, trustworthy | SaaS dashboards, enterprise tools, admin panels |
| 3 | Warm | Human, approachable, friendly | Consumer apps, community platforms, education |
| 4 | Expressive | Romantic, artistic, distinctive | Creative portfolios, lifestyle brands, fashion |
| 5 | Cinematic | Immersive, dramatic, unforgettable | Wedding sites, event experiences, storytelling |

### KGS Declaration

**Project:** Knowledge Graph Studio  
**Emotional Intensity:** **Level 2 — Professional**

**Rationale:** KGS is an enterprise admin tool. Users need clarity and trust, not emotional stimulation. The design should feel competent and reliable.

---

## Emotional Intensity Effects

Intensity level affects these design decisions:

### Color Warmth

| Intensity | Color Temperature | Saturation | Contrast |
|-----------|-------------------|------------|----------|
| 1 (Clinical) | Cool (blue/gray) | Low | High |
| 2 (Professional) | Neutral | Low-medium | High |
| 3 (Warm) | Warm (yellow/orange hints) | Medium | Medium-high |
| 4 (Expressive) | Warm or bold | High | Medium |
| 5 (Cinematic) | Dramatic (deep contrasts) | Variable | Variable |

### Motion Intensity

| Intensity | Duration | Complexity | Easing |
|-----------|----------|------------|--------|
| 1 (Clinical) | 100ms | None | Linear |
| 2 (Professional) | 120-180ms | Subtle | Ease-out |
| 3 (Warm) | 180-240ms | Standard | Ease-in-out |
| 4 (Expressive) | 240-400ms | Layered | Custom curves |
| 5 (Cinematic) | 400ms+ | Complex | Choreographed |

### Typography Expressiveness

| Intensity | Font Style | Weight Range | Letter Spacing |
|-----------|------------|--------------|----------------|
| 1 (Clinical) | Geometric sans | 400-500 | Tight |
| 2 (Professional) | Modern sans | 400-600 | Normal |
| 3 (Warm) | Humanist sans | 400-700 | Normal-open |
| 4 (Expressive) | Mixed (serif+sans) | 300-800 | Variable |
| 5 (Cinematic) | Display faces | 200-900 | Dramatic |

### Image Usage

| Intensity | Photography | Illustration | Icon Style |
|-----------|-------------|--------------|------------|
| 1 (Clinical) | None | None | Line, minimal |
| 2 (Professional) | Sparse | Sparse | Outlined, consistent |
| 3 (Warm) | Some | Some | Rounded, friendly |
| 4 (Expressive) | Prominent | Prominent | Artistic, varied |
| 5 (Cinematic) | Full-bleed | Custom | Custom illustrated |

### White Space Density

| Intensity | Spacing Ratio | Breathing Room |
|-----------|---------------|----------------|
| 1 (Clinical) | Tight (1:1) | Minimal |
| 2 (Professional) | Balanced (1:1.5) | Moderate |
| 3 (Warm) | Open (1:2) | Generous |
| 4 (Expressive) | Variable | Dramatic contrast |
| 5 (Cinematic) | Extreme | Full-screen moments |

---

## Rule: No Random Intensity Mixing

**A project must maintain consistent emotional intensity.**

### Forbidden
- ❌ Level 2 dashboard with Level 5 hero animation
- ❌ Level 1 data table with Level 4 decorative elements
- ❌ Level 3 marketing page with Level 1 checkout flow

### Allowed
- ✅ Level 2 throughout (KGS standard)
- ✅ Level 2 primary with Level 3 accent (sparingly)
- ✅ Level 5 intro → Level 3 content (wedding sites)

**Enforcement:** Design Director evaluates emotional consistency.

---

## 2. Emotional Triggers Framework

Design elements trigger emotional responses. Map them intentionally.

### Color Psychology

| Color | Emotional Association | Use Case |
|-------|----------------------|----------|
| Blue | Trust, stability, calm | Enterprise, finance, healthcare |
| Green | Growth, success, nature | Finance, health, environment |
| Purple | Creativity, luxury, wisdom | Creative, premium, education |
| Red | Urgency, passion, danger | Sales, alerts, entertainment |
| Orange | Energy, friendliness, warmth | Consumer, food, community |
| Yellow | Optimism, clarity, warmth | Education, creative, children |
| Gray | Neutrality, sophistication | Enterprise, tech, minimal |
| Black | Power, elegance, mystery | Luxury, fashion, premium |

### Typography Emotional Mapping

| Typography | Emotional Association | Use Case |
|------------|----------------------|----------|
| Geometric Sans (Inter, Geist) | Modern, clean, tech | SaaS, startups, tech |
| Humanist Sans (Open Sans, Lato) | Friendly, approachable | Consumer, education, community |
| Serif (Merriweather, Source Serif) | Traditional, trustworthy, romantic | Editorial, wedding, luxury |
| Monospace (JetBrains Mono) | Technical, precise, code | Developer tools, data |
| Display (Custom) | Distinctive, memorable | Brand moments, heroes |

### Motion Emotional Mapping

| Motion Type | Emotional Association | Use Case |
|-------------|----------------------|----------|
| Fade | Subtle, calm | Content transitions |
| Slide | Directional, purposeful | Navigation, lists |
| Scale | Emphasis, importance | Cards, CTAs |
| Rotate | Playful, casual | Icons, toggles |
| Bounce | Friendly, casual | Consumer, playful |
| Elastic | Energetic, dynamic | Sports, entertainment |
| Smooth Parallax | Premium, immersive | Storytelling, wedding |

### Spacing Emotional Mapping

| Spacing | Emotional Association | Use Case |
|---------|----------------------|----------|
| Tight (4-8px) | Analytical, dense, efficient | Data dashboards, terminals |
| Standard (16px) | Balanced, professional | Most SaaS, admin tools |
| Generous (24-32px) | Premium, calm, confident | Marketing, landing pages |
| Extreme (48px+) | Luxury, editorial, dramatic | High-end brands, wedding |

### Depth Emotional Mapping

| Depth | Emotional Association | Use Case |
|-------|----------------------|----------|
| Flat (no shadow) | Minimal, modern, clean | portfolios, minimal brands |
| Subtle (shadow-sm) | Professional, restrained | Enterprise, SaaS |
| Layered (shadow-md) | Organized, clear | Dashboards, cards |
| Elevated (shadow-lg+) | Important, interactive | Modals, floating elements |
| Floating (multiple layers) | Premium, immersive | Storytelling, wedding |

---

## Emotional Consistency Checklist

Design Director must evaluate:

### Color
- [ ] Color temperature matches intensity level
- [ ] Saturation consistent throughout
- [ ] No jarring color shifts between sections

### Typography
- [ ] Font personality matches intensity
- [ ] Weight range appropriate for level
- [ ] No random font switches

### Motion
- [ ] Motion intensity matches declared level
- [ ] No Level 5 animations in Level 2 project
- [ ] Duration system followed

### Spacing
- [ ] Spacing density matches intensity
- [ ] No tight → extreme jumps
- [ ] White space used intentionally

### Depth
- [ ] Shadow system matches intensity
- [ ] No flat → floating confusion
- [ ] Elevation hierarchy clear

---

## KGS Emotional Profile

**Project:** Knowledge Graph Studio  
**Intensity:** Level 2 — Professional

**Applied Decisions:**

| Aspect | Level 2 Standard | KGS Implementation |
|--------|------------------|-------------------|
| Color | Neutral, low saturation | Neutral grays, indigo accent |
| Motion | 120-180ms, subtle | 120ms hover, 180ms sidebar |
| Typography | Modern sans, 400-600 | Inter, regular-semibold |
| Images | Sparse | Icons only, no photos |
| Spacing | Balanced (1:1.5) | gap-4, mt-8 standard |
| Depth | Subtle shadows | shadow-sm → shadow-md |

**Emotional Goal:** Users should feel **competent, efficient, and in control** — not excited, not calm, but professionally empowered.

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
