# Nuxt + Vue Implementation Playbook (architecture portfolio)

Conventions, templates and checklists for the `nuxt-vue-development` skill. Stack: Nuxt 4, Vue 3, TypeScript, Nuxt UI + Tailwind CSS, Sanity, Zod, `@nuxt/image`, `@nuxt/fonts`, `@nuxtjs/seo`, `@nuxtjs/i18n`, Sentry, Cloudflare.

## 1. Folder structure

```
app/
  app.vue
  app.config.ts            # Nuxt UI theme (colors, component slots)
  assets/css/main.css      # @import "tailwindcss"; @import "@nuxt/ui"; @theme tokens
  components/
    layout/                # AppHeader, AppFooter, AppMenu
    project/               # ProjectCard, ProjectGallery, ProjectMeta
    ui/                    # project-specific primitives (ImageFrame, SectionTitle)
    forms/                 # QuoteForm
  composables/             # useProjects, useSeoPage, useReveal ...
  layouts/default.vue
  middleware/
  pages/
    index.vue
    arquitetura/index.vue
    arquitetura/[slug].vue
    arquitetura-interiores/[slug].vue
    blog/[slug].vue
    servicos.vue
    contactos.vue
    peca-um-orcamento.vue
  plugins/                 # gsap.client.ts, lenis.client.ts
  utils/
server/
  api/contact.post.ts
  api/quote.post.ts
  utils/rateLimit.ts, sanitize.ts, mailer.ts
shared/
  types/sanity.ts          # shared TS types (Project, Post)
  schemas/forms.ts         # Zod schemas (used client + server)
nuxt.config.ts
.env  (never committed)   .env.example (committed)
```

Naming: components PascalCase (`ProjectCard.vue`), composables `useXxx.ts`, server routes `name.method.ts`.

## 2. `nuxt.config.ts` baseline

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/sanity',
    '@sentry/nuxt/module',
    '@nuxt/eslint',
  ],
  css: ['~/assets/css/main.css'],
  typescript: { strict: true },
  site: { url: 'https://www.example.com', name: 'AC Arquitetos' },
  image: { quality: 80, format: ['avif', 'webp'] },
  nitro: { preset: 'cloudflare-pages' },
  runtimeConfig: {
    turnstileSecret: '',          // NUXT_TURNSTILE_SECRET (server only)
    mailApiKey: '',               // NUXT_MAIL_API_KEY (server only)
    public: { sentryDsn: '' },    // public by design
  },
  routeRules: {
    '/': { prerender: true },
    '/sobre-nos': { prerender: true },
    '/arquitetura/**': { swr: 3600 },
    '/blog/**': { swr: 3600 },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
  app: { head: { htmlAttrs: { lang: 'pt-PT' } } },
})
```

Check the current docs of each module for exact option names before relying on them (module APIs change).

## 3. Page pattern (Sanity data + SEO + images)

```vue
<script setup lang="ts">
import type { Project } from '~~/shared/types/sanity'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: project, error } = await useAsyncData(
  () => `project-${slug.value}`,
  () => $fetch<Project>('/api/projects/' + slug.value),
)

if (error.value || !project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

useSeoMeta({
  title: () => project.value!.title,
  description: () => project.value!.excerpt,
  ogTitle: () => project.value!.title,
  ogDescription: () => project.value!.excerpt,
  twitterCard: 'summary_large_image',
})
defineOgImage({ url: project.value.cover.url, alt: project.value.cover.alt })
</script>

<template>
  <article>
    <header>
      <h1>{{ project!.title }}</h1>
    </header>
    <NuxtImg
      :src="project!.cover.url"
      :alt="project!.cover.alt"
      width="2400" height="1350"
      sizes="100vw"
      fetchpriority="high"
      preload
    />
    <!-- Below the fold -->
    <NuxtImg
      v-for="img in project!.gallery" :key="img._key"
      :src="img.url" :alt="img.alt"
      :width="img.width" :height="img.height"
      sizes="(min-width: 992px) 50vw, 100vw"
      loading="lazy" fetchpriority="low"
    />
  </article>
</template>
```

Sanity access: either the `@nuxtjs/sanity` module (`useSanityQuery`) or a Nitro route that runs GROQ with a read-only client. Keep tokens server-side. Never render CMS HTML with `v-html`; use a Portable Text renderer.

## 4. Priority Hints cheatsheet

| Resource | Attribute |
|---|---|
| Hero / LCP image | `fetchpriority="high"` + `preload` (only one) |
| Critical font | preload via `@nuxt/fonts` config / `<link rel="preload" as="font" fetchpriority="high">` |
| Above-the-fold secondary images | default |
| Below-the-fold images, carousels, thumbnails | `loading="lazy"` + `fetchpriority="low"` |
| Analytics / Sentry replay / non-critical scripts | `fetchpriority="low"` + `defer`/idle load |

Never mark more than 1-2 resources `high` per page.

## 5. Composable pattern

```ts
// app/composables/useProjects.ts
import type { ProjectSummary } from '~~/shared/types/sanity'

export const useProjects = (category: MaybeRefOrGetter<'arquitetura' | 'interiores'>) =>
  useAsyncData(
    () => `projects-${toValue(category)}`,
    () => $fetch<ProjectSummary[]>('/api/projects', { query: { category: toValue(category) } }),
    { default: () => [] },
  )
```

Rules: return refs, no side effects at import time, typed inputs/outputs, SSR-safe.

## 6. Forms (REFERENCE EXAMPLE ONLY - the form solution is not decided)

> Do not implement this unless the user chooses a Nitro-based approach. Ask first. The example below is one possible option, not a project decision.

Shared schema (`shared/schemas/forms.ts`):

```ts
import { z } from 'zod'

export const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10).max(2000),
  honeypot: z.string().max(0).optional(),     // must stay empty
  turnstileToken: z.string().min(1),
})
export type QuoteInput = z.infer<typeof quoteSchema>
```

Server route (`server/api/quote.post.ts`):

```ts
import { quoteSchema } from '~~/shared/schemas/forms'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  await enforceRateLimit(`quote:${ip}`, { limit: 5, windowSeconds: 600 }) // server/utils/rateLimit.ts

  const body = await readValidatedBody(event, quoteSchema.parse)
  if (body.honeypot) return { ok: true }  // silently drop bots

  const human = await verifyTurnstile(body.turnstileToken, ip, config.turnstileSecret)
  if (!human) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })

  await sendMail({
    // strip CR/LF in header-bound fields (header injection)
    replyTo: body.email.replace(/[\r\n]/g, ''),
    subject: 'New quote request',
    text: `${body.name}\n${body.phone ?? ''}\n\n${body.message}`,  // plain text, never raw HTML
  })
  return { ok: true }
})
```

Generic errors only, no stack traces. On Cloudflare, implement `enforceRateLimit` with KV/Durable Objects or the Cloudflare rate limiting rules (in-memory counters do not persist across isolates).

## 7. Nuxt UI + Tailwind theming

`app/assets/css/main.css`:

```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Cormorant Garamond', serif;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-brick: #7B4744;   /* accent: AA on white (~7:1), NOT for text on black (~2.8:1) */

  --breakpoint-xs: 480px;   /* use max-xs: */
  --breakpoint-sm: 576px;   /* use max-sm: */
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: 1400px;
  --spacing-section: clamp(5rem, 12vw, 12rem);
}
```

Remember to wrap the app in `<UApp>` in `app.vue` (needed by overlays/toasts). Adjust component styling through `app.config.ts` (`ui` key) instead of overriding with ad hoc CSS. Design direction: an architecture website (rigour, solidity, light, materiality), 12-column grid, large images, only the three project colors (#ffffff, #000000, #7B4744), display serif + neutral sans. Breakpoints and colors are fixed by the project `GEMINI.md`; do not invent others.

## 8. Sentry (`@sentry/nuxt`)

- Client init with DSN from `runtimeConfig.public.sentryDsn`; server instrumentation per the module docs.
- `sendDefaultPii: false`; scrub form fields in `beforeSend`; low `tracesSampleRate` in production.
- Source-map upload token only in CI env (`SENTRY_AUTH_TOKEN`), never in the client bundle.
- Add Sentry ingest domain to CSP `connect-src`. Load replay only after consent.

## 9. Security headers and CSP

Use `nuxt-security` or `routeRules.headers`. Allow only needed origins: Sanity CDN (`cdn.sanity.io`) for `img-src`, Sentry ingest, analytics (after consent), Turnstile (`challenges.cloudflare.com`). Add `nonce`/hash strategy rather than `'unsafe-inline'` where possible (GSAP does not need `unsafe-eval`).

## 10. Hydration and SSR troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Hydration text/node mismatch` | `Date.now()`, `Math.random()`, viewport-based render on server | Compute in `onMounted` or wrap in `<ClientOnly>` |
| `window is not defined` | Browser API at module scope/SSR | `import.meta.client` guard, client plugin |
| Content flashes then changes | Fetching in `onMounted` | `useAsyncData` with SSR |
| Data refetched twice | Missing/unstable key | Provide a unique deterministic key |
| 404 pages return 200 | Missing `createError` with `fatal: true` | Throw in page `setup` |

## 11. i18n and SEO notes

- PT-PT default, EN prepared; localised routes, `hreflang`, canonical per locale.
- Schema.org: `Architect`/`LocalBusiness` globally, `CreativeWork` (project), `BlogPosting`, `BreadcrumbList`.
- Keep the old site's URLs (e.g. `/casa-tv`, `/blog`, `/servicos`, `/peca-um-orcamento`, `/contactos`) or add 301 redirects in `routeRules` to avoid losing ranking.

## 12. Pre-merge checklist

- [ ] `<script setup lang="ts">`, no React/Next idioms, no `any` on external data
- [ ] Browser-only code is client-guarded; no hydration warnings in console
- [ ] Data via `useAsyncData`/`useFetch` with stable keys; 404 handled
- [ ] `useSeoMeta`, canonical, OG image/alt, schema.org present
- [ ] Images via `NuxtImg` with dimensions, `sizes`; hero `high`, rest `lazy`/`low`
- [ ] No `v-html` with CMS/user data; secrets only in private `runtimeConfig`
- [ ] Forms: solution confirmed with the user; if implemented, validated server-side, anti-spam and rate limited
- [ ] Keyboard/focus/contrast OK; `prefers-reduced-motion` honoured
- [ ] Semgrep scan clean on changed files
