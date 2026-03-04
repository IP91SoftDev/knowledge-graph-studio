# Design Personality Matrix

**Version:** 1.0  
**Status:** ✅ ENFORCED  
**Authority:** Design Director Agent  
**Effective:** 2026-03-03

---

## Overview

Design personality is the consistent character of a product. It is not style. It is identity.

**Principle:** Personality is chosen, not accidental.

---

## Design Archetypes

Every project must select one primary archetype. This defines all downstream decisions.

---

### 1. Enterprise Trust

**Personality:** Reliable, established, professional

**Use Cases:** Banking, legal, healthcare, government, B2B SaaS

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 2 (Professional) |
| Typography | Geometric sans (Inter, SF Pro) |
| Motion | Level 2 (Subtle, functional only) |
| Depth | Level 2 (Layered, organized) |
| Accent | Conservative (blue, teal) |
| Spacing | Balanced, efficient |
| Color | Cool, low saturation |
| Imagery | Minimal, professional photos |

**Example Projects:**
- Stripe Dashboard
- Linear
- Vercel Admin
- KGS (Knowledge Graph Studio)

---

### 2. Modern SaaS

**Personality:** Clean, efficient, approachable

**Use Cases:** B2B tools, productivity apps, startups

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 2-3 (Professional to Warm) |
| Typography | Modern sans (Inter, Geist) |
| Motion | Level 2 (Subtle, polished) |
| Depth | Level 2 (Clear hierarchy) |
| Accent | Friendly (indigo, purple, green) |
| Spacing | Generous but efficient |
| Color | Fresh, medium saturation |
| Imagery | Illustrations, friendly icons |

**Example Projects:**
- Notion
- Figma
- Slack
- Airtable

---

### 3. AI Futuristic

**Personality:** Cutting-edge, intelligent, mysterious

**Use Cases:** AI tools, ML platforms, tech innovation

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 3 (Warm to Expressive) |
| Typography | Geometric sans + mono accents |
| Motion | Level 3 (Standard, smooth) |
| Depth | Level 3 (Floating, layered) |
| Accent | Neon (purple, cyan, magenta) |
| Spacing | Open, breathable |
| Color | Dark backgrounds, vibrant accents |
| Imagery | Abstract, tech visuals |

**Example Projects:**
- Midjourney
- Runway
- Character.ai
- AI research labs

---

### 4. Elegant Romantic

**Personality:** Sophisticated, emotional, timeless

**Use Cases:** Wedding sites, luxury brands, fashion, jewelry

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 4-5 (Expressive to Cinematic) |
| Typography | Serif dominant (Playfair, Cormorant) |
| Motion | Level 4-5 (Layered, cinematic) |
| Depth | Level 4 (Elevated, floating) |
| Accent | Warm (gold, rose, blush) |
| Spacing | Generous, editorial |
| Color | Warm, muted palette |
| Imagery | High-end photography, soft focus |

**Example Projects:**
- Wedding websites
- Luxury e-commerce
- Fine dining
- Boutique brands

---

### 5. Cinematic Storytelling

**Personality:** Immersive, dramatic, unforgettable

**Use Cases:** Event sites, film portfolios, brand experiences

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 5 (Cinematic) |
| Typography | Display faces, dramatic sizes |
| Motion | Level 5 (Choreographed, parallax) |
| Depth | Level 5 (Multi-layer, immersive) |
| Accent | Dramatic contrast |
| Spacing | Extreme, full-screen moments |
| Color | High contrast, cinematic grading |
| Imagery | Full-bleed, video backgrounds |

**Example Projects:**
- Film festival sites
- Brand campaign microsites
- Portfolio showcases
- Event landing pages

---

### 6. Minimal Portfolio

**Personality:** Restrained, focused, content-first

**Use Cases:** Designer portfolios, photographer sites, resumes

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 1-2 (Clinical to Professional) |
| Typography | Clean sans, editorial |
| Motion | Level 1 (Minimal, opacity only) |
| Depth | Level 1 (Flat, minimal shadows) |
| Accent | None or minimal |
| Spacing | Extreme white space |
| Color | Monochrome or limited palette |
| Imagery | Work samples are the focus |

**Example Projects:**
- Designer portfolios
- Photography portfolios
- Architect portfolios
- Minimal resumes

---

### 7. Playful Interactive

**Personality:** Fun, engaging, surprising

**Use Cases:** Games, children's products, creative agencies

**Characteristics:**
| Aspect | Specification |
|--------|---------------|
| Emotional Intensity | Level 4 (Expressive) |
| Typography | Rounded, friendly faces |
| Motion | Level 4 (Bouncy, elastic) |
| Depth | Level 3 (Playful elevation) |
| Accent | Bright, varied colors |
| Spacing | Irregular, dynamic |
| Color | High saturation, varied |
| Imagery | Illustrations, animations |

**Example Projects:**
- Duolingo
- Mailchimp
- Creative agency sites
- Children's educational apps

---

## Archetype Selection Guide

### For KGS (Knowledge Graph Studio)

**Selected Archetype:** **Enterprise Trust**

**Rationale:**
- KGS is an internal admin tool for knowledge management
- Users are administrators and analysts
- Trust and clarity are more important than delight
- Professional aesthetic matches enterprise context
- Efficient, not expressive

**Applied Decisions:**

| Aspect | Enterprise Trust Standard | KGS Implementation |
|--------|--------------------------|-------------------|
| Emotional Intensity | Level 2 | Level 2 ✅ |
| Typography | Geometric sans | Inter ✅ |
| Motion | Level 2 (Subtle) | 120/180ms tiers ✅ |
| Depth | Level 2 (Layered) | shadow-sm → shadow-md ✅ |
| Accent | Conservative (blue/indigo) | Indigo-600 ✅ |
| Spacing | Balanced, efficient | gap-4, mt-8 ✅ |
| Color | Cool, low saturation | Neutral grays ✅ |
| Imagery | Minimal | Icons only ✅ |

---

## Archetype Declaration Format

Every project design-profile.md must include:

```markdown
## Design Archetype

**Selected:** [Archetype Name]

**Rationale:**
[2-3 sentences explaining why this archetype fits]

**Applied Characteristics:**

| Aspect | Archetype Standard | Project Implementation |
|--------|-------------------|----------------------|
| Emotional Intensity | Level X | Level X + notes |
| Typography | [font] | [font] + notes |
| Motion | Level X | Level X + notes |
| Depth | Level X | Level X + notes |
| Accent | [color] | [color] + notes |
| Spacing | [style] | [style] + notes |
| Color | [palette] | [palette] + notes |
| Imagery | [style] | [style] + notes |
```

---

## Archetype Violation Examples

### ❌ REJECTED

```markdown
Project: Enterprise Dashboard
Archetype: Enterprise Trust
BUT:
- Uses Level 5 cinematic parallax scrolling
- Uses serif display fonts for headlines
- Uses bouncy elastic animations
- Uses bright neon accent colors
```

**Issue:** Archetype mismatch. Enterprise Trust does not use cinematic motion or playful colors.

### ✅ APPROVED

```markdown
Project: Enterprise Dashboard
Archetype: Enterprise Trust
Implementation:
- Level 2 emotional intensity
- Inter (geometric sans) typography
- 120/180ms subtle motion
- Layered depth (shadow-sm → shadow-md)
- Indigo accent (conservative)
- Balanced, efficient spacing
- Neutral gray palette
- Minimal iconography
```

**Issue:** None. All characteristics align with Enterprise Trust archetype.

---

## Archetype Consistency Checklist

Design Director must verify:

### Declaration
- [ ] Archetype explicitly declared in design-profile.md
- [ ] Rationale provided (why this archetype fits)
- [ ] All characteristics mapped

### Implementation
- [ ] Emotional intensity matches archetype
- [ ] Typography matches archetype
- [ ] Motion intensity matches archetype
- [ ] Depth style matches archetype
- [ ] Accent strategy matches archetype
- [ ] Spacing matches archetype
- [ ] Color palette matches archetype
- [ ] Imagery matches archetype

### Consistency
- [ ] No archetype mixing (Enterprise + Cinematic)
- [ ] All pages consistent with archetype
- [ ] All components consistent with archetype

---

*Last updated: 2026-03-03*  
*KGS Design Governance System*
