import { computed } from 'vue'
import type { SupportedLocale } from '~/composables/useLocale'

export interface WineExperienceItem {
  id: string
  title: string
  price: string
  unit: Record<SupportedLocale, string>
  languages: Record<SupportedLocale, string>
  highlights: Record<SupportedLocale, string[]>
  image: string
  alt: Record<SupportedLocale, string>
  duration: string
}

export interface WineGallerySlide {
  id: string
  src: string
  alt: Record<SupportedLocale, string>
}

export const wineGallerySlides: WineGallerySlide[] = [
  {
    id: 'gallery-imgl3860',
    src: '/images/gallery/IMGL3860.jpg',
    alt: {
      pt: 'Jardins e vinhas da Quinta Vale da Roca em Sintra',
      en: 'Gardens and vineyards at Quinta Vale da Roca in Sintra',
    },
  },
  {
    id: 'wine-exp-ehz1424',
    src: '/images/wine-experiences/EHZ_1424-1.jpg',
    alt: {
      pt: 'Adega e barricas de carvalho da Quinta Vale da Roca',
      en: 'Winery and oak barrels at Quinta Vale da Roca',
    },
  },
]

export const wineExperiencesCatalog: WineExperienceItem[] = [
  {
    id: 'terroir-tour',
    title: 'TERROIR TOUR',
    price: '40€',
    unit: {
      pt: 'por pessoa / 1h',
      en: 'per person / 1h',
    },
    languages: {
      pt: 'Inglês e português',
      en: 'English and Portuguese',
    },
    highlights: {
      pt: [
        'Visita guiada à vinha e à adega',
        'Prova de 3 vinhos',
        'Pão, azeitonas e tábua de queijos regionais',
      ],
      en: [
        'Guided tour of the vineyard and winery',
        'Tasting of 3 wines',
        'Bread, olives and regional cheese board',
      ],
    },
    image: '/images/wine-experiences/Terroir-Tour.jpg',
    alt: {
      pt: 'Terroir Tour — Prova de vinhos e tábua de queijos na vinha',
      en: 'Terroir Tour — Wine tasting and cheese board in the vineyard',
    },
    duration: '1h',
  },
  {
    id: 'discovery-tour',
    title: 'DISCOVERY TOUR',
    price: '55€',
    unit: {
      pt: 'por pessoa / 1h30m',
      en: 'per person / 1h30m',
    },
    languages: {
      pt: 'Inglês e português',
      en: 'English and Portuguese',
    },
    highlights: {
      pt: [
        'Visita guiada à vinha e à adega',
        'Prova de 5 vinhos, incluindo a gama Premium',
        'Harmonização com pão, azeitonas, queijos regionais e seleção de enchidos',
      ],
      en: [
        'Guided tour of the vineyard and winery',
        'Tasting of 5 wines, including the Premium range',
        'Pairing with bread, olives, regional cheeses and charcuterie selection',
      ],
    },
    image: '/images/wine-experiences/Discovery-Tour.jpg',
    alt: {
      pt: 'Discovery Tour — Prova de 5 vinhos e harmonização regional',
      en: 'Discovery Tour — 5-wine tasting and regional pairing',
    },
    duration: '1h30m',
  },
  {
    id: 'hike-and-wine',
    title: 'HIKE & WINE',
    price: '75€',
    unit: {
      pt: 'por pessoa / 2h',
      en: 'per person / 2h',
    },
    languages: {
      pt: 'Inglês e português',
      en: 'English and Portuguese',
    },
    highlights: {
      pt: [
        'Visita guiada panorâmica pelos recantos mais escondidos da quinta',
        'Prova de 5 vinhos, incluindo a gama Premium',
        'Harmonização com pão, azeitonas, queijos regionais e seleção de enchidos',
      ],
      en: [
        'Panoramic guided tour through the estate’s hidden corners',
        'Tasting of 5 wines, including the Premium range',
        'Pairing with bread, olives, regional cheeses and charcuterie selection',
      ],
    },
    image: '/images/wine-experiences/Hike-and-Wine.jpg',
    alt: {
      pt: 'Hike & Wine — Caminhada guiada pela propriedade e prova de vinhos',
      en: 'Hike & Wine — Guided estate walk and wine tasting',
    },
    duration: '2h',
  },
]

export function useWineExperiences() {
  const experiences = computed(() => wineExperiencesCatalog)
  const slides = computed(() => wineGallerySlides)

  return {
    experiences,
    slides,
  }
}
