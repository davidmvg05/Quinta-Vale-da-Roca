// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: {
      vueCompilerOptions: {
        plugins: [],
      },
    },
  },

  fonts: {
    families: [
      {
        name: 'Cormorant Garamond',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
      },
      {
        name: 'Inter',
        provider: 'google',
        weights: [300, 400, 500, 600],
        styles: ['normal'],
      },
    ],
  },

  icon: {
    collections: ['solar', 'ph'],
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },

  image: {
    quality: 85,
    format: ['avif', 'webp'],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-PT',
      },
      title: 'Quinta Vale da Roca — Hotel & Experiências Vínicas em Sintra',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Entre a serra de Sintra e o Atlântico, descubra o refúgio de enoturismo, alojamento boutique e vinhos de carácter único da Quinta Vale da Roca.',
        },
        { property: 'og:title', content: 'Quinta Vale da Roca — Hotel & Experiências Vínicas' },
        {
          property: 'og:description',
          content: 'Enoturismo, natureza e luxo sereno em Sintra. Alojamento boutique e vinhos de colheita própria.',
        },
        { property: 'og:image', content: '/images/brand/vdr-social-sharing.jpg' },
        { name: 'theme-color', content: '#1D351B' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
        { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      ],
    },
  },
})
