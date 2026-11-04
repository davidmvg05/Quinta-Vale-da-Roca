import { computed } from 'vue'
import type { SupportedLocale } from '~/composables/useLocale'

export interface RoomAmenityTag {
  icon: string
  label: Record<SupportedLocale, string>
}

export interface RoomCatalogItem {
  id: string
  slug: string
  name: Record<SupportedLocale, string>
  image: string
  secondaryImage: string
  alt: Record<SupportedLocale, string>
  amenities: [RoomAmenityTag, RoomAmenityTag, RoomAmenityTag]
}

const roomCatalog: RoomCatalogItem[] = [
  {
    id: 'panorama-residence',
    slug: 'panorama-residence',
    name: {
      pt: 'Panorama Residence',
      en: 'Panorama Residence',
    },
    image: '/images/rooms/panorama-residence/16.jpg',
    secondaryImage: '/images/rooms/panorama-residence/01.jpg',
    alt: {
      pt: 'Suite Panorama Residence na Quinta Vale da Roca com vista sobre a vinha e o Atlântico',
      en: 'Panorama Residence Suite at Quinta Vale da Roca overlooking the vineyard and the Atlantic',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '120 m²', en: '120 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama King-Size', en: 'King-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-arinto',
    slug: 'arinto',
    name: {
      pt: 'Suite Arinto',
      en: 'Suite Arinto',
    },
    image: '/images/rooms/arinto/quinta-vale-da-roca-room-arinto00003.jpg',
    secondaryImage: '/images/rooms/arinto/quinta-vale-da-roca-room-arinto00001.jpg',
    alt: {
      pt: 'Suite Arinto com luz natural e vista serena na Quinta Vale da Roca',
      en: 'Suite Arinto with natural light and serene view at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '35 m²', en: '35 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama Queen-Size', en: 'Queen-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-encruzado',
    slug: 'encruzado',
    name: {
      pt: 'Suite Encruzado',
      en: 'Suite Encruzado',
    },
    image: '/images/rooms/encruzado/quinta-vale-da-roca-room-encruzado00004.jpg',
    secondaryImage: '/images/rooms/encruzado/quinta-vale-da-roca-room-encruzado00001.jpg',
    alt: {
      pt: 'Suite Encruzado com terraço privativo na Quinta Vale da Roca',
      en: 'Suite Encruzado with private terrace at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '38 m²', en: '38 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama Queen-Size', en: 'Queen-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-jampal',
    slug: 'jampal',
    name: {
      pt: 'Suite Jampal',
      en: 'Suite Jampal',
    },
    image: '/images/rooms/jampal/quinta-vale-da-roca-room-jampal00001.jpg',
    secondaryImage: '/images/rooms/jampal/quinta-vale-da-roca-room-jampal00002.jpg',
    alt: {
      pt: 'Suite Jampal com horizonte atlântico na Quinta Vale da Roca',
      en: 'Suite Jampal with Atlantic horizon at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '40 m²', en: '40 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama King-Size', en: 'King-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-malvasia',
    slug: 'malvasia',
    name: {
      pt: 'Suite Malvasia',
      en: 'Suite Malvasia',
    },
    image: '/images/rooms/malvasia/quinta-vale-da-roca-room-malvasia00002.jpg',
    secondaryImage: '/images/rooms/malvasia/quinta-vale-da-roca-room-malvasia00005.jpg',
    alt: {
      pt: 'Suite Malvasia com design orgânico na Quinta Vale da Roca',
      en: 'Suite Malvasia with organic design at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '36 m²', en: '36 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama Queen-Size', en: 'Queen-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-pinot-noir',
    slug: 'pinot-noir',
    name: {
      pt: 'Suite Pinot Noir',
      en: 'Suite Pinot Noir',
    },
    image: '/images/rooms/pinot-noir/quinta-vale-da-roca-room-pinot-noir00006.jpg',
    secondaryImage: '/images/rooms/pinot-noir/quinta-vale-da-roca-room-pinot-noir00001.jpg',
    alt: {
      pt: 'Suite Pinot Noir com zona de estar contemplativa na Quinta Vale da Roca',
      en: 'Suite Pinot Noir with contemplative living lounge at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '42 m²', en: '42 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama King-Size', en: 'King-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-ramisco',
    slug: 'ramisco',
    name: {
      pt: 'Suite Ramisco',
      en: 'Suite Ramisco',
    },
    image: '/images/rooms/ramisco/quinta-vale-da-roca-room-ramisco00006.jpg',
    secondaryImage: '/images/rooms/ramisco/quinta-vale-da-roca-room-ramisco00002.jpg',
    alt: {
      pt: 'Suite Ramisco rodeada pelos jardins de Sintra na Quinta Vale da Roca',
      en: 'Suite Ramisco surrounded by Sintra gardens at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '35 m²', en: '35 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama Queen-Size', en: 'Queen-Size Bed' },
      },
    ],
  },
  {
    id: 'suite-castelao',
    slug: 'castelao',
    name: {
      pt: 'Suite Castelão',
      en: 'Suite Castelão',
    },
    image: '/images/rooms/castelao/quinta-vale-da-roca-room-castela-o00005.jpg',
    secondaryImage: '/images/rooms/castelao/quinta-vale-da-roca-room-castela-o00001.jpg',
    alt: {
      pt: 'Suite Castelão com arquitetura contemporânea na Quinta Vale da Roca',
      en: 'Suite Castelão with contemporary architecture at Quinta Vale da Roca',
    },
    amenities: [
      {
        icon: 'solar:maximize-square-linear',
        label: { pt: '32 m²', en: '32 m²' },
      },
      {
        icon: 'solar:bath-linear',
        label: { pt: 'WC Privativo', en: 'Private Bathroom' },
      },
      {
        icon: 'solar:bed-linear',
        label: { pt: 'Cama Queen-Size', en: 'Queen-Size Bed' },
      },
    ],
  },
]

export function useRooms() {
  const rooms = computed(() => roomCatalog)

  return {
    rooms,
  }
}
