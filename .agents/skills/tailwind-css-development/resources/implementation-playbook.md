# Tailwind CSS Implementation Playbook (Pet Memorial Design System)

Guideline for the Pet Memorial visual system: serene, dignified, sober and accessible.

## 1. Palette Specification

- **Primary Brand Color (`#52858B`):** Slated Teal / Sage Blue. Evokes tranquility, solemnity, memory and peace.
- **Pure White (`#FFFFFF`):** Backgrounds, clean cards, contrast elements.
- **Deep Charcoal / Black (`#000000`, `#18181B`, `#0F172A`):** Sharp, legible text with zero visual noise.

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        pet: {
          teal: {
            50: '#F2F7F7',
            100: '#E1EDEE',
            200: '#C5DCDF',
            300: '#9EC2C7',
            400: '#75A5AC',
            500: '#52858B', // Brand Core Color
            600: '#426D72',
            700: '#38595D',
            800: '#324C50',
            900: '#2D4144',
            950: '#1A282A'
          },
          dark: '#121516',
          muted: '#64748B',
          light: '#F8FAFA'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      lineHeight: {
        relaxed: '1.75'
      }
    }
  },
  plugins: []
};
```

## 2. Typography Pairing Rules

- **Headings (`h1`, `h2`, `h3`, `h4`):** Use `font-serif` (Cormorant Garamond) with `tracking-tight` or `tracking-normal`. Conveys nobility, reverence, and solemnity.
- **Subheadings & Lead Paragraphs:** `font-sans font-light` or `font-normal` (Montserrat) with generous line height (`leading-relaxed`).
- **Buttons & Metadata (Labels, Hours, Badges):** `font-sans uppercase tracking-wider text-xs font-semibold`.

## 3. UI Component Patterns

### Dignified Service Card
```html
<article class="bg-white border border-pet-teal-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
  <div>
    <span class="inline-block px-3 py-1 bg-pet-teal-50 text-pet-teal-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
      Cremação Individual
    </span>
    <h3 class="font-serif text-2xl text-zinc-900 font-semibold mb-3">
      Despedida e Devolução das Cinzas
    </h3>
    <p class="text-zinc-600 font-sans leading-relaxed text-sm">
      Processo isolado e exclusivo. Acesso à sala de despedida, entrega das cinzas no próprio dia e certificado oficial.
    </p>
  </div>
  <div class="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
    <span class="text-xs text-zinc-500 font-sans">Acompanhamento presencial</span>
    <a href="/servicos/cremacao-individual" class="text-pet-teal-600 font-sans text-sm font-medium hover:text-pet-teal-800 transition-colors">
      Saber mais &rarr;
    </a>
  </div>
</article>
```

### Emergency 24/7 Sticky Bar (Mobile & Desktop)
```html
<aside class="sticky top-0 z-50 bg-pet-teal-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-sans flex items-center justify-center gap-2 shadow-sm">
  <span>Apoio Imediato e Recolhas 24 Horas:</span>
  <a href="tel:+351914347109" class="font-bold underline hover:text-pet-teal-100 transition-colors">
    Sintra: 914 347 109
  </a>
  <span class="hidden md:inline">|</span>
  <a href="tel:+351910754666" class="font-bold underline hover:text-pet-teal-100 transition-colors hidden md:inline">
    Pombal: 910 754 666
  </a>
</aside>
```
