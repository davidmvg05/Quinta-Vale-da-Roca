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
  }
  wineSubtitleLines: [string, string]
  wineDescription: string
  winesCta: string
}

const dictionary: Record<SupportedLocale, HeroCopy> = {
  pt: {
    brandSubtitle: 'Quinta Vale da Roca',
    leftTitle: 'HOTEL',
    rightTitle: 'EXPERIÊNCIAS VÍNICAS',
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
    },
    wineSubtitleLines: [
      'Vinhos de carácter único,',
      'nascidos junto ao Atlântico.',
    ],
    wineDescription: 'Vinhos de carácter único, nascidos junto ao Atlântico.',
    winesCta: 'Vinhos',
  },
  en: {
    brandSubtitle: 'Quinta Vale da Roca',
    leftTitle: 'HOTEL',
    rightTitle: 'EXPERIÊNCIAS VÍNICAS',
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
    },
    wineSubtitleLines: [
      'Wines of unique character,',
      'born along the Atlantic.',
    ],
    wineDescription: 'Wines of unique character, born along the Atlantic.',
    winesCta: 'Wines',
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
