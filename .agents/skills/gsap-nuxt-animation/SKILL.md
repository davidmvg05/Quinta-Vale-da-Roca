---
name: gsap-nuxt-animation
description: Design and implement GSAP animations in Nuxt 4 / Vue 3 with ScrollTrigger, SplitText, Flip, Lenis smooth scroll, page transitions and prefers-reduced-motion support, with correct SSR safety and cleanup. Use PROACTIVELY for any scroll animation, reveal, parallax, horizontal gallery, text animation, page transition, preloader or smooth-scroll task in a Nuxt project, especially for architecture/portfolio sites that need refined, intentional motion.
---

# GSAP in Nuxt (architectural motion design)

You are a motion engineer who makes websites feel like architecture: calm, precise, spacious, with movement that reveals space, scale, light and detail. You write GSAP code that is SSR-safe, leak-free, accessible and fast.

## Use this skill when

- Adding reveals, parallax, pinned/horizontal galleries, scroll-scrubbed sequences or text animation (SplitText)
- Building page transitions (Nuxt `pageTransition`) or shared-element transitions (Flip)
- Integrating Lenis smooth scroll with GSAP/ScrollTrigger
- Building a preloader/intro, custom cursor, or menu open/close animation
- Debugging ScrollTrigger issues (wrong positions, duplicates after navigation, jank, memory leaks)

## Do not use this skill when

- The task is general Nuxt structure, data fetching, SEO or forms (use `nuxt-vue-development`)
- A pure CSS transition/animation is enough (hover, simple fade): prefer CSS
- You are told to use another animation library

## Design principles (what "architectural" motion means)

1. **Motion with purpose.** Every animation reveals content, guides attention or explains spatial change. No decoration for its own sake.
2. **Slow in, soft out.** Prefer `power2.out`, `power3.out`, `expo.out`; durations 0.8-1.4s for large elements, 0.4-0.7s for UI. Avoid bounce/elastic/back.
3. **Restraint.** One signature effect per section. Stagger small (0.05-0.12). Never animate everything at once.
4. **Image-led.** Reveal photography with `clip-path` and subtle scale (1.15 -> 1), parallax of at most 10-15%.
5. **Typography-led.** Large editorial headings revealed line by line with masks (SplitText).
6. **Accessible.** Content readable with JS off and with `prefers-reduced-motion: reduce`.

## Non-negotiable technical rules

1. **Client-only.** Register GSAP and plugins in `app/plugins/gsap.client.ts`. Never import/run GSAP in server code or at module scope of shared files. Animate inside `onMounted`.
2. **Always use a context.** Wrap animations in `gsap.context(() => {...}, scopeEl)` (or `gsap.matchMedia()`), and call `ctx.revert()` in `onBeforeUnmount`/`onScopeDispose`. This kills tweens and ScrollTriggers and restores inline styles.
3. **Scope selectors** to the component root (`gsap.context(fn, rootRef)`); no global selectors that leak across pages. Prefer template refs over class selectors.
4. **Animate cheap properties only:** `x/y/scale/rotation`, `opacity` (`autoAlpha`), `clip-path`. Never `width/height/top/left/margin`.
5. **Reduced motion.** Use `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` condition: show final state, no scrub/parallax/long transitions.
6. **No flash of hidden content.** Set the initial hidden state in JS with `gsap.set`/`from` (client) or with a `.js-ready` class added at mount, never a bare CSS `opacity: 0` that stays hidden if JS fails.
7. **Lenis + ScrollTrigger sync** exactly as in the playbook (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add`, `lagSmoothing(0)`), created once (plugin/composable), destroyed on teardown.
8. **Refresh deliberately.** Call `ScrollTrigger.refresh()` after images/fonts/layout change (e.g. after `NuxtImg` load, route transition end, accordion open). Set `invalidateOnRefresh: true` when values depend on size.
9. **Page transitions.** Use Nuxt `pageTransition` with `mode: 'out-in'` and JS hooks (`onLeave(el, done)` / `onEnter(el, done)`); kill old triggers on leave and refresh after enter.
10. **Mobile.** Use `matchMedia` breakpoints: simplify or disable pinning/heavy parallax on small screens or low-power devices.

## Workflow

1. **Define the intent** in one sentence ("reveal the project hero as the page loads", "horizontal gallery scrubbed by scroll").
2. **Pick the pattern** from `resources/implementation-playbook.md` (reveal, image mask, text split, parallax, horizontal scroll, pin, Flip, page transition, preloader, menu).
3. **Implement as a composable or component** (`useReveal`, `useParallax`, `<AnimatedHeading>`), SSR-safe, context-scoped, with reduced-motion branch.
4. **Test behaviours:** navigate between pages repeatedly (no duplicate triggers), resize, reduced-motion on, slow CPU throttling, keyboard navigation unaffected.
5. **Check performance:** no layout thrash, `will-change` only where needed, fewer than ~10 simultaneously active ScrollTriggers per view when possible.
6. **Run Semgrep** on changed files (per project `GEMINI.md`). Never inject unsanitised data into `innerHTML` (including with SplitText).

## Quick pattern chooser

| Goal | Pattern |
|---|---|
| Fade/slide content in on scroll | `ScrollTrigger` + `gsap.from` with `once: true`, batch for lists (`ScrollTrigger.batch`) |
| Image reveal | `clip-path: inset(...)` + inner image scale, triggered on enter |
| Heading entrance | `SplitText` lines with mask + `yPercent: 110` stagger |
| Parallax image | `yPercent` tween with `scrub: true`, modest range |
| Horizontal project gallery | Pinned section + `x` tween with `scrub`, `invalidateOnRefresh` |
| Thumbnail -> detail page | `Flip.getState` / `Flip.from` (or `clip-path` page transition) |
| Smooth scroll | Lenis wired to GSAP ticker |
| Page transitions | Nuxt `pageTransition` hooks + `ScrollTrigger.refresh()` |
| Intro/preloader | Timeline once per session (`useState`/`sessionStorage` flag), skippable, short (< 2.5s) |
| Reduced motion | `gsap.matchMedia` branch rendering the end state |

## Common bugs and fixes

- **Triggers fire twice after navigating back:** missing `ctx.revert()` or created outside a context.
- **Wrong start/end positions:** images/fonts loaded late -> `ScrollTrigger.refresh()` after load; avoid lazy images without dimensions.
- **Jitter with Lenis:** ticker not synced or two RAF loops; use a single `gsap.ticker` loop with `lagSmoothing(0)`.
- **Hydration warnings:** animation code ran during SSR; move to `onMounted`/client plugin.
- **Pin spacing breaks layout:** wrap the pinned element, use `pinSpacing` intentionally, and refresh after layout changes.
- **Text jumps after SplitText:** await `document.fonts.ready` or use `SplitText.create(..., { autoSplit: true, onSplit })`.

## Safety

- Do not expose private data through animated text that is injected as HTML.
- Do not remove reduced-motion handling "for simplicity".
- Do not add paid/unofficial GSAP builds; use the official `gsap` npm package.

## Resources

- `resources/implementation-playbook.md` for the plugin, composables, patterns, page transition setup and checklists.
