import { computed } from 'vue'
import type { SupportedLocale } from '~/composables/useLocale'

export interface ShopProduct {
  id: string
  name: Record<SupportedLocale, string>
  price: string
  image: string
  description: Record<SupportedLocale, string>
}

export const shopProductsCatalog: ShopProduct[] = [
  {
    id: 'malvasia-de-colares-2024',
    name: {
      pt: 'Malvasia de Colares 2024',
      en: 'Malvasia de Colares 2024',
    },
    price: '38,00 €',
    image: '/images/shop/Malvasia-2024.png',
    description: {
      pt: 'Vinho branco de colheita própria, perfil salino e fresco das encostas atlânticas de Sintra.',
      en: 'Estate white wine with saline, fresh Atlantic character from Sintra slopes.',
    },
  },
  {
    id: 'tinto-grande-reserva',
    name: {
      pt: 'Tinto Grande Reserva',
      en: 'Red Grand Reserve',
    },
    price: '45,00 €',
    image: '/images/shop/Grande-Reserva.png',
    description: {
      pt: 'Estrutura refinada, complexidade aromática e estágio nobre em barricas de carvalho francês.',
      en: 'Refined structure, aromatic complexity and noble aging in French oak barrels.',
    },
  },
  {
    id: 'encruzado',
    name: {
      pt: 'Encruzado Vale da Roca',
      en: 'Encruzado Vale da Roca',
    },
    price: '28,00 €',
    image: '/images/shop/encruzado.png',
    description: {
      pt: 'Mineralidade atlântica incomparável, frescura vibrante e volume gastronómico equilibrado.',
      en: 'Incomparable Atlantic minerality, vibrant freshness and balanced gastronomic volume.',
    },
  },
]

export function useShop() {
  const products = computed(() => shopProductsCatalog)

  return {
    products,
  }
}
