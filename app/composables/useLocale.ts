export type SupportedLocale = 'pt' | 'en'

export interface HeroCopy {
  brandSubtitle: string
  leftTitle: string
  rightTitle: string
  mainHeadline: string
  apartmentsTitle: string
  apartmentsPrevLabel: string
  apartmentsNextLabel: string
  viewRoom: string
  nav: {
    rooms: string
    aboutUs: string
    contacts: string
    book: string
    wines: string
  }
  wineSubtitleLines: [string, string]
  wineDescription: string
  winesCta: string
  eventsTitle: string
  eventsPrevLabel: string
  eventsNextLabel: string
  wineExperiencesTitle: string
  wineExperiencesHeaderTitle: string
  wineExperiencesDescription: string
  wineCarouselPrevLabel: string
  wineCarouselNextLabel: string
  wineTastingsSubheading: string
  languagesLabel: string
  bookExperience: string
  shopTitle: string
  addToCart: string
  perBottle: string
}

const dictionary: Record<SupportedLocale, HeroCopy> = {
  pt: {
    brandSubtitle: 'Quinta Vale da Roca',
    leftTitle: 'HOTEL',
    rightTitle: 'Experiências Vínicas',
    mainHeadline: 'VINHOS DE CARÁCTER ÚNICO, NASCIDOS JUNTO AO ATLÂNTICO.',
    apartmentsTitle: 'Apartamentos',
    apartmentsPrevLabel: 'Quarto anterior',
    apartmentsNextLabel: 'Próximo quarto',
    viewRoom: 'VER QUARTO',
    nav: {
      rooms: 'Quartos',
      aboutUs: 'Sobre Nós',
      contacts: 'Contactos',
      book: 'Reservar',
      wines: 'Vinhos',
    },
    wineSubtitleLines: [
      'Vinhos de carácter único,',
      'nascidos junto ao Atlântico.',
    ],
    wineDescription: 'Vinhos de carácter único, nascidos junto ao Atlântico.',
    winesCta: 'Vinhos',
    eventsTitle: 'Eventos',
    eventsPrevLabel: 'Evento anterior',
    eventsNextLabel: 'Próximo evento',
    wineExperiencesTitle: 'Experiências Vínicas',
    wineExperiencesHeaderTitle: 'Experiências Vínicas',
    wineExperiencesDescription:
      'Explore os jardins, as vinhas e a adega, e descubra como são produzidos os vinhos da Quinta Vale da Roca.',
    wineCarouselPrevLabel: 'Imagem anterior',
    wineCarouselNextLabel: 'Próxima imagem',
    wineTastingsSubheading: 'Visitas e Provas de Vinhos',
    languagesLabel: 'Idiomas disponíveis',
    bookExperience: 'RESERVAR EXPERIÊNCIA',
    shopTitle: 'Loja',
    addToCart: 'ADICIONAR AO CARRINHO',
    perBottle: 'por garrafa',
  },
  en: {
    brandSubtitle: 'Quinta Vale da Roca',
    leftTitle: 'HOTEL',
    rightTitle: 'Wine Experiences',
    mainHeadline: 'WINES OF UNIQUE CHARACTER, BORN ALONG THE ATLANTIC.',
    apartmentsTitle: 'Apartments',
    apartmentsPrevLabel: 'Previous room',
    apartmentsNextLabel: 'Next room',
    viewRoom: 'VIEW ROOM',
    nav: {
      rooms: 'Rooms',
      aboutUs: 'About Us',
      contacts: 'Contacts',
      book: 'Book',
      wines: 'Wines',
    },
    wineSubtitleLines: [
      'Wines of unique character,',
      'born along the Atlantic.',
    ],
    wineDescription: 'Wines of unique character, born along the Atlantic.',
    winesCta: 'Wines',
    eventsTitle: 'Events',
    eventsPrevLabel: 'Previous event',
    eventsNextLabel: 'Next event',
    wineExperiencesTitle: 'Wine Experiences',
    wineExperiencesHeaderTitle: 'Wine Experiences',
    wineExperiencesDescription:
      'Explore the gardens, vineyards and winery, and discover how Quinta Vale da Roca wines are crafted.',
    wineCarouselPrevLabel: 'Previous image',
    wineCarouselNextLabel: 'Next image',
    wineTastingsSubheading: 'Visits and Wine Tastings',
    languagesLabel: 'Available languages',
    bookExperience: 'BOOK EXPERIENCE',
    shopTitle: 'Shop',
    addToCart: 'ADD TO CART',
    perBottle: 'per bottle',
  },
}

export function useSiteLocale() {
  const route = useRoute()
  const locale = useState<SupportedLocale>('vdr-locale', () => {
    const queryLang = route.query.lang
    if (queryLang === 'en') return 'en'
    return 'pt'
  })

  const copy = computed<HeroCopy>(() => dictionary[locale.value])

  function setLocale(next: SupportedLocale) {
    locale.value = next
  }

  function toggleLocale() {
    locale.value = locale.value === 'pt' ? 'en' : 'pt'
  }

  return {
    locale,
    copy,
    setLocale,
    toggleLocale,
  }
}
