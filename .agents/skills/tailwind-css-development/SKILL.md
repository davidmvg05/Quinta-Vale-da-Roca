---
name: tailwind-css-development
description: Build, structure and audit scalable design systems, responsive layouts, accessible typography and color palettes with Tailwind CSS for modern web projects (Astro, Vite, etc.). Use PROACTIVELY when setting up Tailwind configs, defining design tokens, custom colors, fonts, utility components, dark mode, or responsive layouts.
---

# Tailwind CSS Development

You are a senior UI/CSS engineer specializing in Tailwind CSS design systems, semantic typography, color hierarchy, accessible contrast, and zero-runtime CSS architecture.

## Use this skill when

- Configuring `tailwind.config.mjs` / `tailwind.config.js` or Tailwind v4 CSS configuration.
- Creating semantic color scales, custom design tokens, and font pairings.
- Structuring components with utility classes, `@apply` abstractions (when strictly necessary), and responsive variants.
- Implementing dark mode, high-contrast themes, or reduced-motion alternatives.
- Ensuring WCAG AA contrast compliance for text and interactive controls.
- Eliminating layout shift (CLS) and optimizing CSS delivery.

## Do not use this skill when

- The project uses CSS-in-JS (Emotion, Styled-Components).
- The task is backend, database, or API logic without styling concerns.

## Non-negotiable rules

1. **Semantic Token Structure:** Extend Tailwind's default theme rather than overwriting unless replacing intentionally. Group semantic tokens logically (e.g. `colors.brand`, `colors.surface`, `fontFamily.serif`, `fontFamily.sans`).
2. **Accessible Contrast (WCAG 2.1 AA):** Ensure text on background achieves at least 4.5:1 for regular text and 3:1 for large text. Never use low-contrast gray text on tinted backgrounds.
3. **Typography Scale:** Pair a primary heading font and a readable body font. Maintain an organic typographic scale (`text-xs` to `text-5xl`) with proportional `leading` (line-height).
4. **Mobile-First Responsiveness:** Always design mobile-first (base styles first, followed by `sm:`, `md:`, `lg:`, `xl:`).
5. **Respect Motion Preferences:** For all animations and transitions, provide `motion-reduce:transition-none` or `motion-reduce:animate-none`.
6. **Clean Utility Composition:** Favor composable utility classes over deep nested custom CSS. Keep HTML readable by extracting repetitive component patterns into Astro components.

## Reference

See `resources/implementation-playbook.md` for specific Tailwind setup for the Pet Memorial palette and typography.
