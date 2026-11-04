# GSAP + Nuxt Implementation Playbook

Templates and patterns for the `gsap-nuxt-animation` skill. Install: `pnpm add gsap lenis`. GSAP 3.13+ ships all plugins (ScrollTrigger, SplitText, Flip, ScrollSmoother...) free in the `gsap` package; import from `gsap/ScrollTrigger`, `gsap/SplitText`, `gsap/Flip`. Verify exact APIs against the official GSAP docs when in doubt.

## 1. Client-only plugin (register once)

`app/plugins/gsap.client.ts`

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip)
  gsap.defaults({ ease: 'power3.out', duration: 1 })
  ScrollTrigger.config({ ignoreMobileResize: true })

  return { provide: { gsap, ScrollTrigger, SplitText, Flip } }
})
```

Usage in components: `const { $gsap, $ScrollTrigger } = useNuxtApp()` (client only). Alternatively import `gsap` directly inside `onMounted` code paths.

## 2. Lenis smooth scroll synced with GSAP

`app/plugins/lenis.client.ts`

```ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return { provide: { lenis: null } }   // native scroll for reduced motion

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false })

  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // Reset scroll on route change (works with page transitions)
  nuxtApp.hook('page:transition:finish', () => {
    lenis.scrollTo(0, { immediate: true })
    ScrollTrigger.refresh()
  })

  return { provide: { lenis } }
})
```

Note: plugin order. If `gsap.client.ts` must register ScrollTrigger first, name files `01.gsap.client.ts`, `02.lenis.client.ts`. Stop Lenis (`lenis.stop()`) while modals/menus are open.

## 3. Component pattern (context + cleanup + reduced motion)

```vue
<script setup lang="ts">
import gsap from 'gsap'

const root = ref<HTMLElement | null>(null)
let mm: gsap.MatchMedia | undefined

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 992px)',
    },
    (ctx) => {
      const { reduce, desktop } = ctx.conditions as Record<string, boolean>
      if (reduce) return                       // final state is plain CSS, nothing hidden

      gsap.from(root.value!.querySelectorAll('[data-reveal]'), {
        autoAlpha: 0, y: desktop ? 40 : 20, stagger: 0.1,
        scrollTrigger: { trigger: root.value, start: 'top 80%', once: true },
      })
    },
    root.value!,                                // scope
  )
})

onBeforeUnmount(() => mm?.revert())             // kills tweens + ScrollTriggers
</script>
```

Prefer a reusable composable to avoid repeating this boilerplate (section 4).

## 4. Reusable composable: `useGsapContext`

`app/composables/useGsapContext.ts`

```ts
import gsap from 'gsap'

type Setup = (ctx: gsap.Context, conditions: Record<string, boolean>) => void | (() => void)

export function useGsapContext(scope: Ref<HTMLElement | null>, setup: Setup) {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    if (!scope.value) return
    mm = gsap.matchMedia()
    mm.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        mobile: '(max-width: 767px)',
        desktop: '(min-width: 768px)',
      },
      (ctx) => setup(ctx as unknown as gsap.Context, ctx.conditions as Record<string, boolean>),
      scope.value,
    )
  })

  onBeforeUnmount(() => mm?.revert())
}
```

Use it everywhere, so cleanup and reduced-motion are consistent.

## 5. Patterns

### 5.1 Scroll reveal (batch for lists)

```ts
useGsapContext(root, (_ctx, { reduce }) => {
  if (reduce) return
  gsap.set('[data-reveal]', { autoAlpha: 0, y: 40 })
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 1 }),
  })
})
```

### 5.2 Image mask reveal (clip-path + inner scale)

```ts
useGsapContext(root, (_c, { reduce }) => {
  if (reduce) return
  root.value!.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((frame) => {
    const img = frame.querySelector('img')
    gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
      .fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.out' })
      .fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
  })
})
```

### 5.3 Heading lines with SplitText mask

```ts
import { SplitText } from 'gsap/SplitText'

useGsapContext(root, (_c, { reduce }) => {
  if (reduce) return
  SplitText.create(root.value!.querySelectorAll('[data-split]'), {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,                 // re-splits on resize / font load
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: self.elements[0], start: 'top 85%', once: true },
      })
    },
  })
})
```

Returning the tween from `onSplit` lets GSAP revert/replay correctly on re-split. Keep original text accessible (SplitText sets `aria-label`; do not hide real content from screen readers).

### 5.4 Parallax image

```ts
gsap.fromTo('[data-parallax] img',
  { yPercent: -8 },
  { yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '[data-parallax]', start: 'top bottom', end: 'bottom top', scrub: true } })
```

Container needs `overflow: hidden` and the image slightly taller (`scale-110`/`h-[115%]`).

### 5.5 Horizontal project gallery (pinned)

```ts
useGsapContext(root, (_c, { reduce, desktop }) => {
  if (reduce || !desktop) return            // vertical stack on mobile / reduced motion
  const track = root.value!.querySelector<HTMLElement>('[data-track]')!
  const distance = () => track.scrollWidth - window.innerWidth

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: root.value, pin: true, scrub: 1,
      end: () => '+=' + distance(),
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })
})
```

Refresh after images inside the track load (`@load` on `NuxtImg` -> `ScrollTrigger.refresh()` debounced) since they change `scrollWidth`.

### 5.6 Flip shared-element (grid <-> detail, filter reorder)

```ts
import { Flip } from 'gsap/Flip'

function applyFilter(update: () => void) {
  const state = Flip.getState('[data-card]')
  update()                                   // change classes / DOM order
  Flip.from(state, { duration: 0.8, ease: 'power3.inOut', absolute: true, stagger: 0.03,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1 }),
    onLeave: (els) => gsap.to(els, { opacity: 0 }) })
}
```

### 5.7 Menu open/close timeline

Create the timeline paused once (`gsap.timeline({ paused: true })`), `play()`/`reverse()` on toggle; set `inert`/`aria-expanded`, trap focus, call `lenis.stop()/start()`. Under reduced motion toggle visibility without tweens.

### 5.8 Preloader/intro (once per session)

```ts
const seen = useState('intro-seen', () => false)
onMounted(() => {
  if (seen.value || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('is-intro')
  gsap.timeline({ onComplete: () => { seen.value = true; document.documentElement.classList.remove('is-intro') } })
    .to('[data-intro-line]', { scaleX: 1, duration: 0.9, ease: 'expo.inOut' })
    .to('[data-intro]', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
})
```

Keep under ~2.5s, make it skippable, and never block LCP content from being in the HTML.

## 6. Page transitions (Nuxt + GSAP)

`app/app.vue`

```vue
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const pageTransition = {
  name: 'page',
  mode: 'out-in' as const,
  css: false,
  onLeave(el: Element, done: () => void) {
    gsap.to(el, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in', onComplete: done })
  },
  onEnter(el: Element, done: () => void) {
    gsap.fromTo(el, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      onComplete: () => { done(); ScrollTrigger.refresh() },
    })
  },
}
</script>
```

Rules: component `onBeforeUnmount` reverts its context, so old triggers disappear when `onLeave` finishes; refresh after enter; respect reduced motion by setting `duration: 0` (or skipping the hooks) when `matchMedia` says reduce. For an overlay/clip-path curtain, animate a fixed element living in the layout, not the page element.

## 7. Performance checklist

- [ ] Only `transform`, `opacity`, `clip-path` animated
- [ ] `will-change: transform` only on elements that are animated continuously; removed afterwards
- [ ] ScrollTrigger `once: true` for one-time reveals; `scrub` only where needed
- [ ] `gsap.ticker.lagSmoothing(0)` only with Lenis; single RAF loop
- [ ] Images have dimensions (no layout shift) and `ScrollTrigger.refresh()` is debounced
- [ ] Heavy sections (pin, parallax) disabled on mobile via `matchMedia`
- [ ] No animation of elements outside the viewport (use triggers, not always-on tweens)

## 8. Accessibility checklist

- [ ] `prefers-reduced-motion` branch present in every animation
- [ ] Content visible and operable without JS (no permanent `opacity: 0` in CSS)
- [ ] Focus never trapped behind transitions; skip link works; focus moved to `<h1>`/main after page transition
- [ ] No flashing (> 3 flashes/second), no autoplay motion that cannot be paused
- [ ] Smooth scroll never blocks keyboard scrolling, anchor links or browser find

## 9. Debug recipes

- `ScrollTrigger.getAll().length` after repeated navigation must stay stable; if it grows, there is a missing revert.
- Use `markers: true` temporarily; remove before commit.
- Call `ScrollTrigger.refresh()` after fonts (`document.fonts.ready`) and image loads.
- Throttle CPU 4x in DevTools Performance to find janky pinned/parallax sections.
