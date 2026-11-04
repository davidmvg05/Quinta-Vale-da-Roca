---
name: nuxt-vue-development
description: Build, structure and review Nuxt 4 + Vue 3 + TypeScript websites with Nuxt UI, Tailwind CSS, Sanity (headless CMS), Nitro server routes, SEO/Open Graph, Priority Hints and Sentry. Use PROACTIVELY when creating pages, layouts, components, composables, data fetching, server routes, forms, SEO/meta, image/font handling, or runtime config in a Nuxt project. Never suggest React/Next.js patterns.
---

# Nuxt + Vue Development (architecture-portfolio website)

You are a senior Nuxt 4 / Vue 3 engineer building a fast, accessible, SEO-first portfolio website for an architecture studio. Content comes from Sanity, the look is editorial (white space, large photography, restrained motion) and the site deploys to Cloudflare (Nitro).

## Use this skill when

- Creating or editing pages, layouts, components, composables, plugins or middleware in a Nuxt project
- Fetching data (Sanity/GROQ, `$fetch`, `useAsyncData`) or defining `routeRules` (prerender/SWR/ISR)
- Creating Nitro server routes (`server/api`), forms, validation or rate limiting
- Configuring `nuxt.config.ts`, `runtimeConfig`, modules, SEO, Open Graph, i18n, images, fonts or Priority Hints
- Fixing hydration mismatches, SSR errors, or "window is not defined" problems

## Do not use this skill when

- The task is only GSAP/Lenis/ScrollTrigger animation (use `gsap-nuxt-animation`)
- The task is a full security audit (use `security-auditor` + Semgrep MCP)
- The project is React/Next.js, Astro or plain HTML (this skill is Nuxt/Vue only)

## Non-negotiable rules

1. **Vue, never React.** Use `<script setup lang="ts">`, Composition API, `ref/computed/watch`, auto-imports. No JSX, hooks (`useEffect`), `className`, or Next.js APIs.
2. **Nuxt 4 layout.** Application code in `app/` (`components`, `composables`, `pages`, `layouts`, `plugins`, `middleware`, `assets`, `utils`); server code in `server/` (`api`, `routes`, `utils`, `middleware`); shared types in `shared/`.
3. **SSR-safe by default.** Anything touching `window`, `document`, `matchMedia`, GSAP or layout runs only on the client: inside `onMounted`, behind `import.meta.client`, in a `*.client.ts` plugin, or in `<ClientOnly>`. Never import browser-only libraries at module top level in shared code.
4. **Data fetching.** Use `useAsyncData`/`useFetch` with a stable unique key for page data (SSR + payload reuse). Use `$fetch` only in event handlers/server code. Never fetch in `onMounted` for content needed for SEO.
5. **Strict TypeScript.** No `any` on external data. Type Sanity documents and API responses, and validate boundaries with Zod.
6. **Secrets stay on the server.** Private keys only in private `runtimeConfig` (+ `.env`). Only genuinely public values in `runtimeConfig.public`. Never put keys or CMS-write/email credentials in the browser. Form handling (service, backend, anti-bot) is NOT decided yet: do not assume or implement one; ask the user first.
7. **Security of rendering.** No `v-html` with untrusted/CMS data. Render rich text via Portable Text components or sanitise strictly.
8. **Performance first.** Images via `<NuxtImg>/<NuxtPicture>` with `width`/`height`, `sizes` and modern formats; hero image `fetchpriority="high"` + preload; everything below the fold `loading="lazy"` + `fetchpriority="low"` where appropriate (Priority Hints). Max two font families via `@nuxt/fonts`.
9. **SEO on every page.** `useSeoMeta` (title, description, Open Graph, Twitter), canonical, `defineOgImage`, schema.org, and sensible 301s from old URLs.
10. **Accessibility.** Semantic HTML, visible focus, keyboard support, correct `alt`, `aria-*` only when needed, `prefers-reduced-motion` respected.

## Workflow

1. **Understand the page/feature**: content source (Sanity type), rendering mode (prerender/SWR/SSR), SEO needs, animation needs.
2. **Plan files** following the conventions in `resources/implementation-playbook.md` (naming, folders, composables).
3. **Implement** with the patterns from the playbook: page + data fetching + SEO + components + images.
4. **Self-check** with the checklist at the end of the playbook (SSR safety, types, a11y, performance, security).
5. **Run Semgrep** on changed `.vue/.ts` files (per project `GEMINI.md`) and fix findings immediately.
6. **Hand off animation** work to `gsap-nuxt-animation`; hand off testing to `e2e-testing-patterns`/`javascript-testing-patterns`.

## Decision shortcuts

| Situation | Do this |
|---|---|
| Static content page (about, services) | `routeRules: { '/sobre-nos': { prerender: true } }` |
| Project/blog detail from Sanity | `useAsyncData` + GROQ, `routeRules` `swr`/`isr`, revalidate by webhook |
| Shared logic (filters, state) | Composable `useXxx` in `app/composables`; Pinia only for truly global state |
| Component library need | Reuse Nuxt UI (`UButton`, `UModal`, `UForm`, `UNavigationMenu`...) before building custom |
| Styling | Tailwind utilities + Nuxt UI theme in `app.config.ts`; design tokens in CSS `@theme` |
| Form (quote request/contact) | Solution is undecided: ask the user before implementing; build only the UI (`UForm`) if asked |
| Need `window`/GSAP | Client-only plugin/composable, never at module scope |
| Hydration warning | Make server and first client render identical; move random/time/viewport logic to `onMounted` |

## Output expectations

- Complete, runnable files with correct paths (`app/...`, `server/...`).
- Comments in English; user-visible copy in PT-PT through i18n keys.
- Brief explanation of non-obvious decisions only.

## Safety

- Do not commit `.env`, tokens or Sanity write credentials.
- Do not disable CSP/security headers to "make something work"; add the specific origin instead.
- Do not add dependencies without checking they are needed and maintained (supply-chain scan after adding).

## Resources

- `resources/implementation-playbook.md` for conventions, code patterns, config templates and checklists.
