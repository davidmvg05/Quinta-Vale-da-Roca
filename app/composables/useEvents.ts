import { computed } from 'vue'
import type { SupportedLocale } from '~/composables/useLocale'

export interface EventCatalogItem {
  id: string
  slug: string
  title: Record<SupportedLocale, string>
  badge: Record<SupportedLocale, string>
  description: Record<SupportedLocale, string>
  ctaText: Record<SupportedLocale, string>
  image: string
  alt: Record<SupportedLocale, string>
  href: string
}

export const eventCatalog: EventCatalogItem[] = [
  {
    id: 'corporate',
    slug: 'eventos-corporativos',
    title: {
      pt: 'Eventos Corporativos',
      en: 'Corporate Events',
    },
    badge: {
      pt: 'Retiros & Teambuilding',
      en: 'Retreats & Teambuilding',
    },
    description: {
      pt: 'Troque o ar condicionado do escritório e as reuniões infinitas pela brisa atlântica de Sintra. Onde os PowerPoint são esquecidos após o primeiro copo de vinho e as melhores decisões da sua equipa nascem entre as vinhas.',
      en: 'Swap office air conditioning and endless meetings for Sintra’s Atlantic breeze. Where PowerPoints are forgotten after the first glass of wine and your team’s greatest decisions are made among the vines.',
    },
    ctaText: {
      pt: 'MENOS ZOOM, MAIS VINHO',
      en: 'LESS ZOOM, MORE WINE',
    },
    image: '/images/gallery/quinta-vale-da-roca-galleryeventos00011.jpg',
    alt: {
      pt: 'Mesa de evento corporativo na Quinta Vale da Roca com vista para o oceano',
      en: 'Corporate event dining table at Quinta Vale da Roca overlooking the ocean',
    },
    href: '/contactos?tipo=corporativo',
  },
  {
    id: 'weddings',
    slug: 'casamentos',
    title: {
      pt: 'Casamentos',
      en: 'Weddings',
    },
    badge: {
      pt: 'Celebrações de Amor',
      en: 'Celebrations of Love',
    },
    description: {
      pt: 'Um cenário cinematográfico sobre o Atlântico onde até os convidados mais cépticos vão verter uma lágrima. Vinho de colheita própria, luz dourada de Sintra e a garantia absoluta de que ninguém vai falar mal da comida.',
      en: 'A cinematic setting over the Atlantic where even the most skeptical guests will shed a tear. Estate-grown wine, Sintra’s golden light, and the absolute guarantee that no one will complain about the catering.',
    },
    ctaText: {
      pt: 'DIZ O «SIM» COM VINHO',
      en: 'SAY YES WITH WINE',
    },
    image: '/images/events/7-1.webp',
    alt: {
      pt: 'Cerimónia de casamento com vista panorâmica sobre o mar na Quinta Vale da Roca',
      en: 'Wedding ceremony with panoramic ocean view at Quinta Vale da Roca',
    },
    href: '/contactos?tipo=casamentos',
  },
  {
    id: 'anniversaries',
    slug: 'aniversarios',
    title: {
      pt: 'Aniversários',
      en: 'Birthdays & Anniversaries',
    },
    badge: {
      pt: 'Festas & Efemérides',
      en: 'Parties & Milestones',
    },
    description: {
      pt: 'Celebrar mais uma volta ao sol não tem de ser uma crise existencial quando o copo nunca fica vazio. Reúna os amigos mais chegados sobre as encostas de Sintra e finja com distinção que está a fazer 25 outra vez.',
      en: 'Celebrating another trip around the sun doesn’t have to be an existential crisis when your glass is never empty. Gather your closest friends on Sintra’s slopes and pretend with distinction that you’re turning 25 again.',
    },
    ctaText: {
      pt: 'FINGE QUE TENS 25',
      en: 'PRETEND YOU’RE 25',
    },
    image: '/images/events/our-events-hero-1.png',
    alt: {
      pt: 'Celebração de aniversário nos relvados panorâmicos da Quinta Vale da Roca',
      en: 'Celebration and party on the panoramic lawns of Quinta Vale da Roca',
    },
    href: '/contactos?tipo=aniversarios',
  },
]

export function useEvents() {
  const events = computed(() => eventCatalog)

  return {
    events,
  }
}
